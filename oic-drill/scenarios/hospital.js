export const hospital = {
  id: 'hospital',
  name: 'Kingston General Hospital',
  sector: 'Public Health',
  dataAtRisk: 'Patient medical records, NIS numbers, addresses, prescription histories, HIV/STI test results',
  recordCount: 45000,
  incident: 'Ransomware has encrypted the patient management system. The attacker is threatening to publish 45,000 patient records on a leak site. IT staff discovered the breach 20 minutes ago.',
  startingBudget: 2500000,
  startingTime: 2880,
  nodes: [
    {
      id: 'h1',
      title: 'Initial Discovery',
      description: 'The IT manager has confirmed ransomware on the patient management system. Staff are panicking. The attacker demands US$50,000 in Bitcoin within 24 hours or the data goes public. You need to decide your first move.',
      timeElapsed: 0,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h1a',
          label: 'Isolate affected systems immediately',
          consequence: 'The network team disconnects the infected servers. The ransomware stops spreading, but several departments lose access to patient records and appointment systems.',
          timeCost: 30,
          budgetCost: 0,
          scoreEffect: { compliance: 5, containment: 15, reputation: 0 },
          unlocks: ['h2', 'h3'],
          locks: [],
          tags: ['isolated_systems']
        },
        {
          id: 'h1b',
          label: 'Keep systems running while investigating',
          consequence: 'You try to preserve normal operations. Within the hour, the ransomware spreads to the billing and pharmacy systems. The scope of the breach has expanded significantly.',
          timeCost: 60,
          budgetCost: 0,
          scoreEffect: { compliance: -5, containment: -15, reputation: 0 },
          unlocks: ['h2', 'h3'],
          locks: [],
          tags: ['systems_running', 'expanded_breach']
        },
        {
          id: 'h1c',
          label: 'Contact the attacker to negotiate',
          consequence: 'You open a dialogue with the attacker. They provide a sample of 500 patient records as proof. This confirms the data exfiltration is real but you have lost valuable containment time.',
          timeCost: 90,
          budgetCost: 0,
          scoreEffect: { compliance: -10, containment: -10, reputation: -5 },
          unlocks: ['h2', 'h3'],
          locks: [],
          tags: ['contacted_attacker']
        }
      ]
    },
    {
      id: 'h2',
      title: 'Engaging External Help',
      description: 'The breach is beyond your internal team\'s capacity. You need to decide whether to bring in external cybersecurity experts and at what level of engagement.',
      timeElapsed: 60,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h2a',
          label: 'Hire a certified incident response firm',
          consequence: 'A reputable firm arrives within 4 hours. They begin forensic imaging and evidence preservation. Their expertise will be critical for understanding the full scope.',
          timeCost: 240,
          budgetCost: 800000,
          scoreEffect: { compliance: 10, containment: 10, reputation: 5 },
          unlocks: ['h4'],
          locks: [],
          tags: ['hired_ir_firm', 'preserved_evidence']
        },
        {
          id: 'h2b',
          label: 'Ask the internal IT team to handle it',
          consequence: 'Your small IT team does their best but they lack forensic expertise. Some log files are accidentally overwritten during their investigation. Evidence integrity is compromised.',
          timeCost: 120,
          budgetCost: 0,
          scoreEffect: { compliance: -5, containment: -5, reputation: 0 },
          unlocks: ['h4'],
          locks: [],
          tags: ['internal_only', 'evidence_compromised']
        },
        {
          id: 'h2c',
          label: 'Contact the Jamaica Cyber Incidents Response Team',
          consequence: 'JaCIRT acknowledges your report and offers advisory support. They recommend you also engage a private firm for hands on response, but your CIRT reporting obligation is now satisfied.',
          timeCost: 45,
          budgetCost: 0,
          scoreEffect: { compliance: 15, containment: 5, reputation: 5 },
          unlocks: ['h4'],
          locks: [],
          tags: ['reported_cirt']
        }
      ]
    },
    {
      id: 'h3',
      title: 'Internal Communication',
      description: 'Hospital staff are asking questions. Nurses on the ward cannot access patient medication records and are resorting to paper. The Chief Medical Officer wants answers.',
      timeElapsed: 90,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h3a',
          label: 'Brief all department heads with honest details',
          consequence: 'Staff appreciate the transparency. Department heads implement paper based workarounds efficiently. However, word leaks to a journalist through a staff member\'s social media post.',
          timeCost: 60,
          budgetCost: 0,
          scoreEffect: { compliance: 5, containment: 0, reputation: -5 },
          unlocks: ['h5'],
          locks: [],
          tags: ['briefed_staff', 'media_leak']
        },
        {
          id: 'h3b',
          label: 'Restrict information to senior management only',
          consequence: 'Frontline staff are confused and frustrated. Some begin speculating on WhatsApp groups, spreading inaccurate information. But the media does not learn of the breach immediately.',
          timeCost: 30,
          budgetCost: 0,
          scoreEffect: { compliance: 0, containment: 0, reputation: 5 },
          unlocks: ['h5'],
          locks: [],
          tags: ['restricted_comms']
        }
      ]
    },
    {
      id: 'h4',
      title: 'Notifying the Information Commissioner',
      description: 'Under Section 22 of the Data Protection Act 2020, you must notify the Office of the Information Commissioner of a personal data breach without undue delay. The clock is ticking.',
      timeElapsed: 180,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h4a',
          label: 'Notify the OIC immediately with what you know so far',
          consequence: 'You submit an initial notification within 72 hours of discovery, as required. The Commissioner\'s office acknowledges receipt and asks to be kept informed. This demonstrates good faith compliance.',
          timeCost: 60,
          budgetCost: 0,
          scoreEffect: { compliance: 20, containment: 0, reputation: 10 },
          unlocks: ['h6'],
          locks: [],
          tags: ['notified_oic']
        },
        {
          id: 'h4b',
          label: 'Wait until the investigation is complete before notifying',
          consequence: 'You delay the notification hoping for better information. Days pass. The OIC learns of the breach from media reports and contacts you directly, noting your failure to report in a timely manner.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -20, containment: 0, reputation: -10 },
          unlocks: ['h6'],
          locks: [],
          tags: ['delayed_oic']
        },
        {
          id: 'h4c',
          label: 'Consult your legal team about notification obligations',
          consequence: 'Legal counsel advises immediate notification and helps prepare a thorough initial report. This costs time but ensures the submission is accurate and complete.',
          timeCost: 120,
          budgetCost: 200000,
          scoreEffect: { compliance: 15, containment: 0, reputation: 5 },
          unlocks: ['h6'],
          locks: [],
          tags: ['notified_oic', 'legal_consulted']
        }
      ]
    },
    {
      id: 'h5',
      title: 'Media Enquiry',
      description: 'A reporter from a major Jamaican newspaper calls the hospital\'s press office asking about "a major data breach affecting thousands of patients." You need a media strategy.',
      timeElapsed: 240,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h5a',
          label: 'Issue a prepared public statement acknowledging the incident',
          consequence: 'Your proactive transparency is noted positively in the media coverage. Patients are concerned but appreciate being informed. The story runs but is balanced.',
          timeCost: 60,
          budgetCost: 50000,
          scoreEffect: { compliance: 5, containment: 0, reputation: 15 },
          unlocks: ['h7'],
          locks: [],
          tags: ['public_statement']
        },
        {
          id: 'h5b',
          label: 'Decline to comment',
          consequence: 'The newspaper publishes a story headlined "Hospital Silent on Massive Patient Data Leak." Social media erupts. Patients begin calling the hospital demanding answers.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: 0, containment: 0, reputation: -20 },
          unlocks: ['h7'],
          locks: [],
          tags: ['no_comment']
        },
        {
          id: 'h5c',
          label: 'Deny that any breach occurred',
          consequence: 'The reporter publishes the denial alongside screenshots from the attacker\'s leak site. Your credibility is destroyed. The OIC opens a formal investigation.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -15, containment: 0, reputation: -25 },
          unlocks: ['h7'],
          locks: [],
          tags: ['denied_breach']
        }
      ]
    },
    {
      id: 'h6',
      title: 'Notifying Affected Patients',
      description: 'The Data Protection Act requires notification to data subjects when a breach is likely to result in a high risk to their rights and freedoms. With sensitive medical data exposed, this threshold is clearly met.',
      timeElapsed: 360,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h6a',
          label: 'Send personalised letters to all 45,000 affected patients',
          consequence: 'Patients receive clear, specific notifications including what data was exposed and what protective steps to take. The process is thorough but expensive and time consuming.',
          timeCost: 480,
          budgetCost: 500000,
          scoreEffect: { compliance: 15, containment: 0, reputation: 10 },
          unlocks: ['h8'],
          locks: [],
          tags: ['notified_patients', 'personalised_notice']
        },
        {
          id: 'h6b',
          label: 'Post a general notice on the hospital website and social media',
          consequence: 'Many affected patients never see the notice, particularly elderly patients without internet access. The OIC later criticises the notification method as insufficient for the severity of the breach.',
          timeCost: 30,
          budgetCost: 10000,
          scoreEffect: { compliance: -5, containment: 0, reputation: -5 },
          unlocks: ['h8'],
          locks: [],
          tags: ['notified_patients', 'generic_notice']
        },
        {
          id: 'h6c',
          label: 'Decide not to notify patients to avoid panic',
          consequence: 'Patients learn of the breach from news reports instead of from you. Several file complaints with the OIC. A class action lawsuit is threatened by a patients\' rights group.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -20, containment: 0, reputation: -15 },
          unlocks: ['h8'],
          locks: [],
          tags: ['no_patient_notice']
        }
      ]
    },
    {
      id: 'h7',
      title: 'The Ransom Decision',
      description: 'The attacker\'s deadline is approaching. They have reduced their demand to US$30,000 (approximately J$4.6 million). Your backups are two weeks old and incomplete. The attacker has published 200 records as a "warning."',
      timeElapsed: 720,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h7a',
          label: 'Refuse to pay and focus on recovery from backups',
          consequence: 'Recovery from backups will take days and some recent data is lost. The attacker publishes the full dataset. However, you have not funded criminal activity and law enforcement commends your stance.',
          timeCost: 480,
          budgetCost: 300000,
          scoreEffect: { compliance: 10, containment: -5, reputation: 5 },
          unlocks: ['h9'],
          locks: [],
          tags: ['refused_ransom', 'data_published']
        },
        {
          id: 'h7b',
          label: 'Pay the ransom',
          consequence: 'You pay. The attacker provides a decryption key that partially works. There is no guarantee they deleted the stolen data. The payment may violate proceeds of crime legislation.',
          timeCost: 120,
          budgetCost: 750000,
          scoreEffect: { compliance: -15, containment: -5, reputation: -10 },
          unlocks: ['h9'],
          locks: [],
          tags: ['paid_ransom']
        }
      ]
    },
    {
      id: 'h8',
      title: 'Credit Monitoring and Support',
      description: 'With NIS numbers and sensitive medical information exposed, affected patients face risks of identity theft and discrimination. You need to decide what support to offer.',
      timeElapsed: 960,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h8a',
          label: 'Offer free credit monitoring and a dedicated helpline',
          consequence: 'Patients appreciate the proactive support. The helpline handles thousands of calls. This is expensive but demonstrates genuine care for affected individuals.',
          timeCost: 120,
          budgetCost: 400000,
          scoreEffect: { compliance: 10, containment: 0, reputation: 15 },
          unlocks: ['h10'],
          locks: [],
          tags: ['offered_support']
        },
        {
          id: 'h8b',
          label: 'Advise patients to monitor their own accounts',
          consequence: 'Many patients lack the resources or knowledge to protect themselves. Media reports contrast your response with best practices. The OIC notes the lack of mitigation measures in their review.',
          timeCost: 15,
          budgetCost: 5000,
          scoreEffect: { compliance: -5, containment: 0, reputation: -10 },
          unlocks: ['h10'],
          locks: [],
          tags: ['minimal_support']
        }
      ]
    },
    {
      id: 'h9',
      title: 'Law Enforcement',
      description: 'The Jamaica Constabulary Force\'s Cyber Crimes Unit has been made aware of the incident through media reports. They want to know if you intend to file a formal report under the Cybercrimes Act.',
      timeElapsed: 1200,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h9a',
          label: 'File a formal report and cooperate fully',
          consequence: 'The Cyber Crimes Unit opens an investigation. Your preserved evidence (if any) becomes critical. Full cooperation strengthens any future prosecution and satisfies your legal obligations.',
          timeCost: 120,
          budgetCost: 50000,
          scoreEffect: { compliance: 15, containment: 5, reputation: 5 },
          unlocks: ['h10'],
          locks: [],
          tags: ['reported_police']
        },
        {
          id: 'h9b',
          label: 'Decline to involve law enforcement',
          consequence: 'Without a formal report, there is no investigation. The attacker faces no consequences. If it emerges that you did not report, your compliance position weakens significantly.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -10, containment: 0, reputation: -5 },
          unlocks: ['h10'],
          locks: [],
          tags: ['no_police']
        }
      ]
    },
    {
      id: 'h10',
      title: 'Post Incident Review',
      description: 'The immediate crisis is subsiding. You need to decide how to handle the aftermath and prevent future incidents.',
      timeElapsed: 2400,
      requiredTags: [],
      excludedByTags: [],
      options: [
        {
          id: 'h10a',
          label: 'Commission an independent security audit and publish the findings',
          consequence: 'The audit reveals significant infrastructure weaknesses but your willingness to be transparent rebuilds trust. The OIC notes this positively in their final assessment.',
          timeCost: 240,
          budgetCost: 350000,
          scoreEffect: { compliance: 10, containment: 10, reputation: 10 },
          unlocks: [],
          locks: [],
          tags: ['security_audit', 'published_findings']
        },
        {
          id: 'h10b',
          label: 'Conduct an internal review only',
          consequence: 'The internal review identifies some issues but lacks the independence to be fully credible. Stakeholders question whether the hospital is truly committed to change.',
          timeCost: 120,
          budgetCost: 50000,
          scoreEffect: { compliance: 5, containment: 5, reputation: 0 },
          unlocks: [],
          locks: [],
          tags: ['internal_review']
        },
        {
          id: 'h10c',
          label: 'Move on without a formal review',
          consequence: 'Without understanding what went wrong, you remain vulnerable to the same attack. Staff morale suffers as lessons go unlearned.',
          timeCost: 0,
          budgetCost: 0,
          scoreEffect: { compliance: -10, containment: -10, reputation: -5 },
          unlocks: [],
          locks: [],
          tags: ['no_review']
        }
      ]
    }
  ]
};
