import GovBar from "components/governance/govBar";
import GovModal from "components/governance/govModal";
import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import styled from "styled-components";
import { nodeURL } from "utils/nodeTransactions";
import {
  generateEndpointProposals,
  generateEndpointProposalTally,
} from "@tharsis/provider";
import Proposal, { ProposalData } from "./proposal";
import { CantoMain, CantoTest } from "constants/networks"
import { toast } from "react-toastify";
import { addNetwork, getChainIdandAccount } from "constants/addCantoToWallet";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  width: 1124px;
  margin: 0 auto 3rem auto;
  .title {
    font-weight: 300;
    font-size: 140px;
    line-height: 130%;
    text-align: center;
    letter-spacing: -0.13em;
    color: #06fc99;
    text-shadow: 0px 12.2818px 12.2818px rgba(6, 252, 153, 0.2);
    margin-top: 4rem;
    margin-bottom: 2rem;
  }

  .subtitle {
    font-size: 40px;
    margin: 0;
    margin-bottom: 5rem;
    a {
      color : var(--primary-color)
    }
  }

  & > button {
    background-color: var(--primary-color);
    border: none;
    border-radius: 0px;
    padding: 0.6rem 2.4rem;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -0.03em;
    width: fit-content;
    margin: 0 auto;
    margin-top: 2rem;

    margin-bottom: 3rem;

    &:hover {
      background-color: var(--primary-color-dark);
      cursor: pointer;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 1rem;
    column-gap: 0.8rem;
  }
`;
const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"
  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
  }
  &-content {
    background-color: black;
    border: 1px solid var(--primary-color);
  }
`;
const Governance = () => {
  const [isOpen, setIsOpened] = useState(false);
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [currentProposal, setCurrentProposal] = useState<ProposalData>();
  const [chainId, account] = getChainIdandAccount();

  //Let the user know they are on the wrong network
  useEffect(() => {
    if (!(Number(chainId)== CantoMain.chainId || Number(chainId)==CantoTest.chainId) && chainId != undefined) {
      toast.error("Please switch to Canto network", {
        toastId: chainId
      })
    }
  },[chainId])

  async function getProposals() {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const allProposals = await fetch(
      nodeURL(Number(chainId)) + generateEndpointProposals(),
      options
    ).then(function (response) {
      return response.json();
    });
    setProposals(allProposals.proposals);
    await addCurrentTally(allProposals.proposals);
  }

  async function queryTally(proposalID: string): Promise<Tally> {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const tally = await fetch(
      nodeURL(Number(chainId)) + generateEndpointProposalTally(proposalID),
      options
    );
    return await tally.json();
  }

  interface Tally {
    tally: {
      yes: string;
      abstain: string;
      no: string;
      no_with_veto: string;
    };
  }

  async function addCurrentTally(proposals: ProposalData[]) {
    proposals.map(async (obj: ProposalData) => {
      if (obj.status == "PROPOSAL_STATUS_VOTING_PERIOD") {
        const ongoingTally = await queryTally(obj.proposal_id);

        const temp = proposals.filter(
          (val) => val.proposal_id != obj.proposal_id
        );
        obj.final_tally_result = { ...ongoingTally.tally };
        temp.push(obj);
        setProposals(temp);
        return obj;
      }
    });
  }

  // ///IF PROPOSAL IS NOT FINISHED, WE MUST USE QUERY TALLY TO GET CURRENT VOTES
  useEffect(() => {
    addNetwork();
    getProposals();
  }, [chainId]);

  const emptyProposal: ProposalData = {
    content: {
      "@type": "none",
      description: "none",
      erc20address: "none",
      title: "none",
    },
    deposit_end_time: "none",
    final_tally_result: {
      abstain: "5",
      no: "3",
      no_with_veto: "8",
      yes: "10",
    },
    proposal_id: "none",
    status: "none",
    submit_time: "none",
    total_deposit: [
      {
        denom: "none",
        amount: "none",
      },
    ],
    voting_end_time: "none",
    voting_start_time: "none",
  };

  function AllGovBars() {
    return (
      <React.Fragment>
        {!proposals
          ? ""
          : proposals
              .map((proposal: ProposalData) => {
                let yes = Number(proposal.final_tally_result.yes);
                let no = Number(proposal.final_tally_result.no);
                let abstain = Number(proposal.final_tally_result.abstain);
                let veto = Number(proposal.final_tally_result.no_with_veto);
                let totalVotes = yes + no + abstain + veto;
                return (
                  <GovBar
                    key={proposal.proposal_id}
                    name={proposal.content.title}
                    proposalID={proposal.proposal_id}
                    yesPecterage={
                      totalVotes == 0 ? 0 : (100 * yes) / totalVotes
                    }
                    noPecterage={totalVotes == 0 ? 0 : (100 * no) / totalVotes}
                    vetoPecterage={
                      totalVotes == 0 ? 0 : (100 * veto) / totalVotes
                    }
                    abstainPecterage={
                      totalVotes == 0 ? 0 : (100 * abstain) / totalVotes
                    }
                    startDate={proposal.voting_start_time}
                    endDate={proposal.voting_end_time}
                    status={proposal.status}
                    onClick={() => {
                      setCurrentProposal(proposal);
                      setIsOpened(true);
                    }}
                  />
                );
              })
              .sort((a: any, b: any) => {
                return b?.props.proposalID - a?.props.proposalID;
              })}
      </React.Fragment>
    );
  }

  return (
    <Container>
      <div className="title">canto governance</div>
      <div className="title subtitle">
        <a href= "https://staking-canto-testnet.netlify.app/">stake</a> your canto to participate in
        governance
      </div>
      {/* <button onClick={() => {
        setIsOpened(true);
      }}>create a new vote</button> */}
      <div className="grid">
        <AllGovBars />
      </div>

      <StyledPopup
        open={isOpen}
        onClose={() => {
          setIsOpened(false);
        }}
      >
        <Proposal
          proposal={currentProposal ?? emptyProposal}
          chainId={Number(chainId)}
        />
      </StyledPopup>
    </Container>
  );
};

export default Governance;
