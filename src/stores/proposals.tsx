import create from "zustand";
import { devtools } from "zustand/middleware";
import { nodeURL } from "utils/nodeTransactions";
import {
    generateEndpointProposals,
    generateEndpointProposalTally,
  } from "@tharsis/provider";

export interface ProposalData {
  content: {
    "@type": string;
    description: string;
    erc20address: string;
    title: string;
  };
  deposit_end_time: string;
  final_tally_result: {
    abstain: string;
    no: string;
    no_with_veto: string;
    yes: string;
  };
  proposal_id: string;
  status: string;
  submit_time: string;
  total_deposit: [
    {
      denom: string;
      amount: string;
    }
  ];
  voting_end_time: string;
  voting_start_time: string;
}

interface Tally {
  tally: {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
  };
}

interface ProposalProps {
  proposals: ProposalData[];
  initProposals: (chainId : number) => void;
  addTallyToProposal: (chainId : number) => void;
  currentProposal : ProposalData | undefined;
  setCurrentProposal : (proposal : ProposalData) => void
}

export const useProposals = create<ProposalProps>()(devtools((set, get) => ({
    proposals : [],
    initProposals: async (chainId : number) => {
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
        set({proposals : allProposals.proposals})},
    addTallyToProposal : (chainId : number) => {
        const proposals = get().proposals;
        proposals.map(async (obj: ProposalData) => {
            if (obj.status == "PROPOSAL_STATUS_VOTING_PERIOD") {
              const ongoingTally = await queryTally(obj.proposal_id, chainId);
      
              const temp = proposals.filter(
                (val) => val.proposal_id != obj.proposal_id
              );
              obj.final_tally_result = { ...ongoingTally.tally };
              temp.push(obj);
              set({proposals: temp});
            }
          });
    },
    currentProposal : undefined,
    setCurrentProposal : (proposal : ProposalData) => set({currentProposal : proposal})
})));

async function queryTally(proposalID: string, chainId:number): Promise<Tally> {
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

