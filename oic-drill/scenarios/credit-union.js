export const creditUnion = {
  id: 'credit-union',
  name: 'Parish Savings Credit Union',
  sector: 'Financial Services',
  dataAtRisk: 'Member account numbers, TRN (Taxpayer Registration Numbers), loan records, salary direct deposit details, KYC documents',
  recordCount: 28000,
  incident: 'A disgruntled former employee has been downloading member data for three weeks via a VPN account that was never revoked. The export was spotted in audit logs this morning.',
  startingBudget: 3000000,
  startingTime: 2880,
  nodes: [
    {
      id: 'c1',
      title: 'Discovery and Access Revocation',
      description: 'Audit logs show the former loan officer\'s VPN account accessed the member database 47 times over the past three weeks, exporting data each time. The account is still active. Your first priority is clear.',
      timeElapsed: 0,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'c1a',
          label: 'Revoke all access immediately and audit every former employee account',
          consequence: 'The VPN account is disabled within minutes. A full audit reveals two other former staff accounts that were never deactivated, though neither shows suspicious activity.',
          timeCost: 120,
          budgetCost: 0,
          scoreEffect: { compliance: 10, containment: 15, reputation: 0 },
          unlocks: ['c2', 'c3'],
          locks: [],
          tags: ['revoked_access', 'full_audit']
        },
        {
          id: 'c1b',
          label: 'Revoke only the identified account',
          consequence: 'The account is disabled quickly. However, you miss that the same person shared credentials with another former colleague who also still has access.',
          timeCost: 15,
          budgetCost: 0,
          scoreEffect: { compliance: 0, containment: 5, reputation: 0 },
          unlocks: ['c2', 'c3'],
          locks: [],
          tags: ['partial_revoke']
        },
        {
          id: 'c1c',
          label: 'Monitor the account silently to gather evidence before revoking',
          consequence: 'While you watch, the former employee downloads another 3,000 records. You capture evidence of the activity, but you have allowed additional data exposure.',
          timeCost: 180,
          budgetCost: 0,
          scoreEffect: { compliance: -10, containment: -10, reputation: 0 },
          unlocks: ['c2', 'c3'],
          locks: [],
          tags: ['monitored_access', 'extra_exposure']
        }
      ]
    },
    {
      id: 'c2',
      title: 'Assessing the Scope',
      description: 'You need to determine exactly what data was taken and how many members are affected. The audit logs are detailed but parsing them requires expertise.',
      timeElapsed: 120,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'c2a',
          label: 'Engage a forensic analyst to reconstruct the full data extraction',
          consequence: 'The analyst determines that 28,000 member records were exported, including TRNs, account balances, and loan details. You now have a clear picture of the breach scope.',
          timeCost: 360,
          budgetCost: 600000,
          scoreEffect: { compliance: 10, containment: 10, reputation: 0 },
          unlocks: ['c4'],
          locks: [],
          tags: ['scope_confirmed', 'forensic_analysis']
        },
        {
          id: 'c2b',
          label: 'Have the IT officer review the logs manually',
          consequence: 'The IT officer estimates "a few thousand records" but cannot be precise. Without forensic rigour, you are unable to tell the OIC exactly what was taken or how many members are affected.',
          timeCost: 240,
          budgetCost: 0,
          scoreEffect: { compliance: -5, containment: 0, reputation: 0 },
          unlocks: ['c4'],
          locks: [],
          tags: ['scope_estimated']
        }
      ]
    },
    {
      id: 'c3',
      title: 'Board Notification',
      description: 'As a credit union, the Board of Directors has fiduciary responsibility to members. The General Manager needs to decide when and how to brief the Board.',
      timeElapsed: 180,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'c3a',
          label: 'Call an emergency Board meeting within 24 hours',
          consequence: 'The Board is alarmed but appreciates the urgency. They authorise emergency spending for incident response and instruct management to prioritise member protection.',
          timeCost: 60,
          budgetCost: 0,
          scoreEffect: { compliance: 5, containment: 5, reputation: 5 },
          unlocks: ['c5'],
          locks: [],
          tags: ['board_briefed']
        },
        {
          id: 'c3b',
          label: 'Wait for the next scheduled Board meeting in two weeks',
          consequence: 'When the Board eventually learns the full details, several directors express anger at not being informed sooner. Trust between management and governance is damaged.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -5, containment: 0, reputation: -10 },
          unlocks: ['c5'],
          locks: [],
          tags: ['board_delayed']
        }
      ]
    },
    {
      id: 'c4',
      title: 'Regulatory Notification',
      description: 'The Data Protection Act 2020 requires breach notification to the OIC. As a financial institution, you may also need to notify the Bank of Jamaica. Time is critical.',
      timeElapsed: 300,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'c4a',
          label: 'Notify both the OIC and the Bank of Jamaica immediately',
          consequence: 'Both regulators acknowledge your timely report. The BOJ offers to issue a sector wide advisory about access management. Your proactive approach is noted favourably.',
          timeCost: 90,
          budgetCost: 0,
          scoreEffect: { compliance: 20, containment: 0, reputation: 10 },
          unlocks: ['c6'],
          locks: [],
          tags: ['notified_oic', 'notified_boj']
        },
        {
          id: 'c4b',
          label: 'Notify the OIC only',
          consequence: 'The OIC accepts your notification. Later, the BOJ contacts you after hearing about the breach from another source and expresses concern about the delayed financial sector notification.',
          timeCost: 45,
          budgetCost: 0,
          scoreEffect: { compliance: 10, containment: 0, reputation: -5 },
          unlocks: ['c6'],
          locks: [],
          tags: ['notified_oic']
        },
        {
          id: 'c4c',
          label: 'Delay notification until you have a complete picture',
          consequence: 'Weeks pass. The former employee begins contacting members directly, offering to "check if their data was compromised" for a fee. The OIC learns of the breach from a member\'s complaint.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -20, containment: -5, reputation: -15 },
          unlocks: ['c6'],
          locks: [],
          tags: ['delayed_oic']
        }
      ]
    },
    {
      id: 'c5',
      title: 'The Former Employee',
      description: 'You have identified the former employee responsible. They were terminated three months ago for performance issues. Your legal advisor asks whether you intend to pursue criminal charges.',
      timeElapsed: 480,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'c5a',
          label: 'Report to the Jamaica Constabulary Force under the Cybercrimes Act',
          consequence: 'The Cyber Crimes Unit takes a statement and begins investigating. Under Section 3 of the Cybercrimes Act 2015, the unauthorised access carries potential criminal penalties.',
          timeCost: 180,
          budgetCost: 100000,
          scoreEffect: { compliance: 15, containment: 5, reputation: 5 },
          unlocks: ['c7'],
          locks: [],
          tags: ['reported_police', 'criminal_charges']
        },
        {
          id: 'c5b',
          label: 'Send a cease and desist letter through your attorneys',
          consequence: 'The letter demands return or destruction of all data. The former employee claims they "don\'t have anything." Without law enforcement involvement, you have no way to verify this or compel compliance.',
          timeCost: 60,
          budgetCost: 150000,
          scoreEffect: { compliance: 0, containment: -5, reputation: 0 },
          unlocks: ['c7'],
          locks: [],
          tags: ['cease_desist']
        },
        {
          id: 'c5c',
          label: 'Take no action against the individual',
          consequence: 'Without consequences, the former employee faces no deterrent. Months later, member data appears for sale on a dark web marketplace.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -10, containment: -15, reputation: -10 },
          unlocks: ['c7'],
          locks: [],
          tags: ['no_action_employee']
        }
      ]
    },
    {
      id: 'c6',
      title: 'Member Notification',
      description: 'With TRNs and financial details exposed, 28,000 members face identity theft and financial fraud risks. You must decide how and when to tell them.',
      timeElapsed: 600,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'c6a',
          label: 'Send individual letters with specific details of what data was compromised',
          consequence: 'Members receive clear, actionable information. Many contact their banks to place fraud alerts. While some close their accounts, most appreciate the transparency.',
          timeCost: 360,
          budgetCost: 350000,
          scoreEffect: { compliance: 15, containment: 0, reputation: 10 },
          unlocks: ['c8'],
          locks: [],
          tags: ['notified_members', 'detailed_notice']
        },
        {
          id: 'c6b',
          label: 'Send a general email to all members',
          consequence: 'The email is vague and does not specify what data was taken. Members are confused. Several call the credit union demanding specifics. The OIC notes the notification lacked required detail.',
          timeCost: 30,
          budgetCost: 5000,
          scoreEffect: { compliance: -5, containment: 0, reputation: -5 },
          unlocks: ['c8'],
          locks: [],
          tags: ['notified_members', 'vague_notice']
        },
        {
          id: 'c6c',
          label: 'Do not notify members',
          consequence: 'Members discover the breach through media coverage. Dozens file complaints with the OIC. A prominent attorney announces he is exploring a class action on behalf of affected members.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -20, containment: 0, reputation: -20 },
          unlocks: ['c8'],
          locks: [],
          tags: ['no_member_notice']
        }
      ]
    },
    {
      id: 'c7',
      title: 'Access Control Overhaul',
      description: 'This breach happened because offboarding procedures failed. You need to decide what systemic changes to make to prevent recurrence.',
      timeElapsed: 960,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'c7a',
          label: 'Implement automated offboarding with multi factor authentication',
          consequence: 'The new system automatically disables all access within one hour of employment termination. MFA is added to all remote access. This is a significant security improvement.',
          timeCost: 480,
          budgetCost: 500000,
          scoreEffect: { compliance: 10, containment: 15, reputation: 5 },
          unlocks: ['c10'],
          locks: [],
          tags: ['automated_offboarding', 'mfa_added']
        },
        {
          id: 'c7b',
          label: 'Update the offboarding checklist and retrain HR',
          consequence: 'The manual process is improved but remains dependent on human compliance. It is cheaper but carries ongoing risk of the same failure recurring.',
          timeCost: 120,
          budgetCost: 50000,
          scoreEffect: { compliance: 5, containment: 5, reputation: 0 },
          unlocks: ['c10'],
          locks: [],
          tags: ['manual_offboarding']
        }
      ]
    },
    {
      id: 'c8',
      title: 'Member Support Services',
      description: 'Affected members are anxious about identity theft. Several have already reported suspicious activity on their TRN accounts with Tax Administration Jamaica.',
      timeElapsed: 1200,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'c8a',
          label: 'Offer free identity protection and a dedicated member support line',
          consequence: 'Members feel cared for. The support line handles hundreds of calls daily. Several members who were going to leave decide to stay with the credit union.',
          timeCost: 120,
          budgetCost: 400000,
          scoreEffect: { compliance: 10, containment: 0, reputation: 15 },
          unlocks: ['c10'],
          locks: [],
          tags: ['offered_protection']
        },
        {
          id: 'c8b',
          label: 'Provide written guidance on self protection measures',
          consequence: 'The guidance document is helpful but impersonal. Members feel the credit union is not doing enough given the severity of the breach.',
          timeCost: 30,
          budgetCost: 20000,
          scoreEffect: { compliance: 0, containment: 0, reputation: -5 },
          unlocks: ['c10'],
          locks: [],
          tags: ['written_guidance']
        }
      ]
    },
    {
      id: 'c10',
      title: 'Lessons Learned',
      description: 'The acute phase is over. The Board wants a formal review. The Jamaica Co-operative Credit Union League has asked you to share lessons with the sector.',
      timeElapsed: 2400,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'c10a',
          label: 'Commission an independent review and share findings with the sector',
          consequence: 'The review produces actionable recommendations. Sharing with the League positions your credit union as a responsible sector leader despite the breach.',
          timeCost: 240,
          budgetCost: 300000,
          scoreEffect: { compliance: 10, containment: 10, reputation: 15 },
          unlocks: [],
          locks: [],
          tags: ['independent_review', 'shared_lessons']
        },
        {
          id: 'c10b',
          label: 'Conduct an internal review and keep findings confidential',
          consequence: 'The internal review identifies gaps but is not shared. The League notes your lack of cooperation. Other credit unions remain vulnerable to similar attacks.',
          timeCost: 120,
          budgetCost: 50000,
          scoreEffect: { compliance: 5, containment: 5, reputation: -5 },
          unlocks: [],
          locks: [],
          tags: ['internal_review']
        }
      ]
    }
  ]
};
