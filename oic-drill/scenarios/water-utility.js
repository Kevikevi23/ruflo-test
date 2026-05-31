export const waterUtility = {
  id: 'water-utility',
  name: 'National Water Commission',
  sector: 'Critical Infrastructure / Utility',
  dataAtRisk: 'Customer billing records, addresses, payment card tokens, meter reading histories, employee HR files',
  recordCount: 320000,
  incident: 'A misconfigured cloud storage bucket has been publicly accessible for an unknown period. A journalist has contacted the press office with screenshots of customer billing data and is publishing in 6 hours.',
  startingBudget: 2000000,
  startingTime: 2160,
  nodes: [
    {
      id: 'w1',
      title: 'Immediate Containment',
      description: 'The journalist\'s email arrived 15 minutes ago. Your cloud team has confirmed the storage bucket is publicly accessible. It contains billing exports, customer addresses, and payment card tokens. You have 6 hours before the story goes live.',
      timeElapsed: 0,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'w1a',
          label: 'Lock down the bucket immediately and begin assessing what was exposed',
          consequence: 'The bucket is secured within 10 minutes. Your team begins reviewing access logs to determine how long it was exposed and who accessed it.',
          timeCost: 30,
          budgetCost: 0,
          scoreEffect: { compliance: 5, containment: 20, reputation: 0 },
          unlocks: ['w2', 'w3'],
          locks: [],
          tags: ['bucket_secured']
        },
        {
          id: 'w1b',
          label: 'Verify the journalist\'s claims before taking action',
          consequence: 'You spend two hours confirming what you already suspected. The bucket remains exposed during this time. Automated scanners from unknown parties are now also accessing the data.',
          timeCost: 120,
          budgetCost: 0,
          scoreEffect: { compliance: -5, containment: -10, reputation: 0 },
          unlocks: ['w2', 'w3'],
          locks: [],
          tags: ['delayed_containment']
        },
        {
          id: 'w1c',
          label: 'Delete the entire bucket to remove the exposure',
          consequence: 'The data is no longer publicly accessible, but you have also destroyed the evidence needed for forensic analysis and regulatory reporting. Your legal team is alarmed.',
          timeCost: 15,
          budgetCost: 0,
          scoreEffect: { compliance: -15, containment: 10, reputation: 0 },
          unlocks: ['w2', 'w3'],
          locks: [],
          tags: ['evidence_destroyed']
        }
      ]
    },
    {
      id: 'w2',
      title: 'Scope and Duration',
      description: 'Cloud access logs only go back 90 days. The bucket may have been exposed for longer. You need to understand the full scope before you can report accurately.',
      timeElapsed: 60,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'w2a',
          label: 'Engage a cloud security firm to conduct a full forensic analysis',
          consequence: 'The firm determines the bucket was exposed for approximately seven months. At least 320,000 customer records were accessible. Several IP addresses from outside Jamaica accessed the data.',
          timeCost: 360,
          budgetCost: 700000,
          scoreEffect: { compliance: 10, containment: 10, reputation: 0 },
          unlocks: ['w4'],
          locks: [],
          tags: ['scope_confirmed', 'forensic_analysis']
        },
        {
          id: 'w2b',
          label: 'Rely on the 90 day logs you have',
          consequence: 'You can only confirm three months of exposure. The true duration remains unknown. Your OIC notification will contain significant gaps.',
          timeCost: 60,
          budgetCost: 0,
          scoreEffect: { compliance: -5, containment: -5, reputation: 0 },
          unlocks: ['w4'],
          locks: [],
          tags: ['scope_partial']
        }
      ]
    },
    {
      id: 'w3',
      title: 'The Journalist',
      description: 'The journalist has given you a courtesy call before publishing. You have approximately 5 hours before the story goes live. This is an opportunity to get ahead of the narrative.',
      timeElapsed: 60,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'w3a',
          label: 'Offer the journalist a full briefing and a prepared statement',
          consequence: 'The journalist appreciates the cooperation. The published story includes your statement prominently and notes that you acted swiftly once informed. The coverage is balanced.',
          timeCost: 90,
          budgetCost: 0,
          scoreEffect: { compliance: 0, containment: 0, reputation: 15 },
          unlocks: ['w5'],
          locks: [],
          tags: ['media_briefing', 'public_statement']
        },
        {
          id: 'w3b',
          label: 'Ask the journalist to delay publication',
          consequence: 'The journalist declines, citing public interest. They note in the article that you attempted to suppress the story. The coverage is unfavourable.',
          timeCost: 30,
          budgetCost: 0,
          scoreEffect: { compliance: 0, containment: 0, reputation: -15 },
          unlocks: ['w5'],
          locks: [],
          tags: ['tried_suppression']
        },
        {
          id: 'w3c',
          label: 'Ignore the journalist and focus on internal response',
          consequence: 'The story publishes without your input. The headline reads "Water Commission Exposes 320,000 Customers\' Private Data." Your phone starts ringing.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: 0, containment: 0, reputation: -10 },
          unlocks: ['w5'],
          locks: [],
          tags: ['ignored_media']
        }
      ]
    },
    {
      id: 'w4',
      title: 'Regulatory Notification',
      description: 'The Data Protection Act 2020 requires notification to the OIC without undue delay. Given the scale (320,000 customers) and the imminent media coverage, timing is everything.',
      timeElapsed: 180,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'w4a',
          label: 'Submit an initial OIC notification before the story publishes',
          consequence: 'The OIC receives your notification before reading about it in the news. They acknowledge your proactive approach and assign a case officer to work with you.',
          timeCost: 60,
          budgetCost: 0,
          scoreEffect: { compliance: 20, containment: 0, reputation: 10 },
          unlocks: ['w6'],
          locks: [],
          tags: ['notified_oic', 'notified_before_media']
        },
        {
          id: 'w4b',
          label: 'Wait until after the forensic analysis is complete',
          consequence: 'By the time you notify, the OIC has already seen the news story. Your delayed notification raises questions about whether you were trying to avoid accountability.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -15, containment: 0, reputation: -10 },
          unlocks: ['w6'],
          locks: [],
          tags: ['delayed_oic']
        }
      ]
    },
    {
      id: 'w5',
      title: 'Government Stakeholders',
      description: 'As a government entity, the NWC reports to the Ministry of Science, Energy, and Technology. The Minister\'s office is calling after seeing the news. Parliament sits next week.',
      timeElapsed: 360,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'w5a',
          label: 'Provide the Minister with a full, honest briefing and remediation plan',
          consequence: 'The Minister is unhappy but appreciates the transparency. In Parliament, they are able to answer questions confidently because they were properly briefed. Your relationship survives.',
          timeCost: 120,
          budgetCost: 0,
          scoreEffect: { compliance: 5, containment: 0, reputation: 10 },
          unlocks: ['w7'],
          locks: [],
          tags: ['minister_briefed']
        },
        {
          id: 'w5b',
          label: 'Minimise the severity in your briefing to the Minister',
          consequence: 'The Minister repeats your downplayed figures in Parliament. When the true scope emerges, they feel misled. Your Managing Director\'s position becomes untenable.',
          timeCost: 30,
          budgetCost: 0,
          scoreEffect: { compliance: -5, containment: 0, reputation: -20 },
          unlocks: ['w7'],
          locks: [],
          tags: ['minister_misled']
        }
      ]
    },
    {
      id: 'w6',
      title: 'Customer Notification',
      description: 'With 320,000 customers affected, notification is a massive logistical challenge. Payment card tokens are involved, adding urgency. The payment processor needs to be informed.',
      timeElapsed: 480,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'w6a',
          label: 'Notify customers by letter, email, and SMS simultaneously, and alert the payment processor',
          consequence: 'Customers are reached through multiple channels. The payment processor invalidates the compromised tokens and issues replacement cards. This is expensive but comprehensive.',
          timeCost: 360,
          budgetCost: 500000,
          scoreEffect: { compliance: 15, containment: 10, reputation: 10 },
          unlocks: ['w8'],
          locks: [],
          tags: ['notified_customers', 'notified_processor', 'multi_channel']
        },
        {
          id: 'w6b',
          label: 'Post a notice on the NWC website and hope customers see it',
          consequence: 'Very few customers check the NWC website. Most learn about the breach from the news. The payment processor is not informed and compromised tokens remain active.',
          timeCost: 15,
          budgetCost: 5000,
          scoreEffect: { compliance: -10, containment: -10, reputation: -10 },
          unlocks: ['w8'],
          locks: [],
          tags: ['notified_customers', 'website_only']
        },
        {
          id: 'w6c',
          label: 'Notify customers but skip the payment processor notification',
          consequence: 'Customers are informed but some experience fraudulent charges because the compromised card tokens are still valid. The payment processor is furious when they learn about the delay.',
          timeCost: 180,
          budgetCost: 200000,
          scoreEffect: { compliance: 5, containment: -10, reputation: -5 },
          unlocks: ['w8'],
          locks: [],
          tags: ['notified_customers', 'skipped_processor']
        }
      ]
    },
    {
      id: 'w7',
      title: 'Cloud Security Remediation',
      description: 'The misconfiguration that caused this breach needs to be fixed, and you need assurance it will not happen again. Your entire cloud posture may have similar weaknesses.',
      timeElapsed: 720,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'w7a',
          label: 'Implement automated cloud security scanning and hire a cloud security engineer',
          consequence: 'Automated scanning immediately flags three other misconfigured resources. The new engineer begins a comprehensive cloud security programme. Future risk is significantly reduced.',
          timeCost: 480,
          budgetCost: 450000,
          scoreEffect: { compliance: 10, containment: 15, reputation: 5 },
          unlocks: ['w10'],
          locks: [],
          tags: ['cloud_scanning', 'hired_engineer']
        },
        {
          id: 'w7b',
          label: 'Fix this specific misconfiguration and add it to the checklist',
          consequence: 'The immediate problem is fixed but you have no visibility into whether similar issues exist. The manual checklist approach is the same process that failed in the first place.',
          timeCost: 60,
          budgetCost: 0,
          scoreEffect: { compliance: 0, containment: 0, reputation: 0 },
          unlocks: ['w10'],
          locks: [],
          tags: ['point_fix']
        }
      ]
    },
    {
      id: 'w8',
      title: 'Law Enforcement Reporting',
      description: 'While the breach was caused by a misconfiguration rather than a criminal attack, the access logs show several foreign IP addresses that systematically downloaded data. This may constitute illegal access under the Cybercrimes Act.',
      timeElapsed: 1080,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'w8a',
          label: 'Report to JaCIRT and the Cyber Crimes Unit with full log data',
          consequence: 'JaCIRT analyses the access patterns and confirms organised data harvesting. They issue an advisory to other government entities. The police open an investigation.',
          timeCost: 120,
          budgetCost: 50000,
          scoreEffect: { compliance: 15, containment: 5, reputation: 5 },
          unlocks: ['w10'],
          locks: [],
          tags: ['reported_cirt', 'reported_police']
        },
        {
          id: 'w8b',
          label: 'Treat it as an internal matter since the misconfiguration was yours',
          consequence: 'Without reporting, the foreign actors face no investigation. If they used the data for fraud, victims will have no law enforcement trail to follow.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -10, containment: -5, reputation: 0 },
          unlocks: ['w10'],
          locks: [],
          tags: ['no_law_enforcement']
        }
      ]
    },
    {
      id: 'w10',
      title: 'Accountability and Reform',
      description: 'The immediate crisis is managed. Parliament\'s Public Accounts Committee has scheduled a hearing. The OIC is preparing their formal assessment. How you close this out matters.',
      timeElapsed: 1800,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'w10a',
          label: 'Commission an independent audit, accept the findings publicly, and implement all recommendations',
          consequence: 'The audit is thorough and critical. Your public acceptance of its findings, combined with a concrete remediation timeline, is seen as a model response. The OIC cites it as best practice.',
          timeCost: 360,
          budgetCost: 400000,
          scoreEffect: { compliance: 10, containment: 10, reputation: 15 },
          unlocks: [],
          locks: [],
          tags: ['independent_audit', 'public_accountability']
        },
        {
          id: 'w10b',
          label: 'Conduct an internal review and report to the Board only',
          consequence: 'The internal review is seen as insufficient by the Parliamentary committee. The OIC notes the lack of independent verification in their assessment.',
          timeCost: 120,
          budgetCost: 50000,
          scoreEffect: { compliance: 5, containment: 5, reputation: -5 },
          unlocks: [],
          locks: [],
          tags: ['internal_review']
        },
        {
          id: 'w10c',
          label: 'Blame the cloud provider and move on',
          consequence: 'The cloud provider publicly responds that the misconfiguration was entirely on the NWC\'s side. Your credibility collapses. The Managing Director is asked to resign.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -15, containment: -5, reputation: -25 },
          unlocks: [],
          locks: [],
          tags: ['blamed_vendor']
        }
      ]
    }
  ]
};
