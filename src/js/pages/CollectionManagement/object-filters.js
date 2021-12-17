export default [
  {
    name: 'confidence',
    label: 'Confidence',
    values: [
      {
        name: 'confidence.ge',
        label: '> ='
      },
      {
        name: 'confidence',
        label: ' = '
      },
      {
        name: 'confidence.le',
        label: '< ='
      }
    ],
    type: 'number'
  },
  {
    name: 'created_by_ref',
    label: 'Created By Ref',
    type: 'string'
  },
  {
    name: 'external_id',
    label: 'External Id',
    type: 'string'
  },
  {
    name: 'labels',
    label: 'Labels',
    type: 'string'
  },
  {
    name: 'object_marking_refs',
    label: 'Object Marking Refs',
    type: 'string'
  },
  {
    name: 'object_refs',
    label: 'Object Refs',
    type: 'string'
  },
  {
    name: 'opinion',
    label: 'Opinion',
    values: [
      {
        name: 'strongly-agree',
        label: 'Strongly Agree'
      },
      {
        name: 'agree',
        label: 'Agree'
      },
      {
        name: 'neutral',
        label: 'Neutral'
      },
      {
        name: 'disagree',
        label: 'Disagree'
      },
      {
        name: 'strongly-disagree',
        label: 'Strongly Disagree'
      }
    ],
    type: 'enum'
  },
  {
    name: 'relationship_type',
    label: 'Relationship Type',
    values: [
      {
        name: 'attributed-to',
        label: 'Attributed To'
      },
      {
        name: 'authored-by',
        label: 'Authored By'
      },
      {
        name: 'av-analysis-of',
        label: 'AV Analysis Of'
      },
      {
        name: 'based-on',
        label: 'Based On'
      },
      {
        name: 'beacons-to',
        label: 'Beacons To'
      },
      {
        name: 'belongs-to',
        label: 'Belongs To'
      },
      {
        name: 'characterizes',
        label: 'Characterizes'
      },
      {
        name: 'communicates-with',
        label: 'Communicates With'
      },
      {
        name: 'compromises',
        label: 'Compromises'
      },
      {
        name: 'consists-of',
        label: 'Consists Of'
      },
      {
        name: 'controls',
        label: 'Controls'
      },
      {
        name: 'delivers',
        label: 'Delivers'
      },
      {
        name: 'derived-from',
        label: 'Derived From'
      },
      {
        name: 'downloads',
        label: 'Downloads'
      },
      {
        name: 'drops',
        label: 'Drops'
      },
      {
        name: 'duplicate-of',
        label: 'Duplicate Of'
      },
      {
        name: 'dynamic-analysis-of',
        label: 'Dynamic Analysis Of'
      },
      {
        name: 'exfiltrates-to',
        label: 'Exfiltrates To'
      },
      {
        name: 'exploits',
        label: 'Exploits'
      },
      {
        name: 'has',
        label: 'Has'
      },
      {
        name: 'hosts',
        label: 'Hosts'
      },
      {
        name: 'impersonates',
        label: 'Impersonates'
      },
      {
        name: 'indicates',
        label: 'Indicates'
      },
      {
        name: 'investigates',
        label: 'Investigates'
      },
      {
        name: 'located-at',
        label: 'Located At'
      },
      {
        name: 'mitigates',
        label: 'Mitigates'
      },
      {
        name: 'originates-from',
        label: 'Originates From'
      },
      {
        name: 'owns',
        label: 'Owns'
      },
      {
        name: 'related-to',
        label: 'Related To'
      },
      {
        name: 'remediates',
        label: 'Remediates'
      },
      {
        name: 'resolves-to',
        label: 'Resolves To'
      },
      {
        name: 'static-analysis-of',
        label: 'Static Analysis Of'
      },
      {
        name: 'targets',
        label: 'Targets'
      },
      {
        name: 'uses',
        label: 'Uses'
      },
      {
        name: 'variant-of',
        label: 'Variant Of'
      }
    ],
    type: 'vocab'
  },
  {
    name: 'sectors',
    label: 'Sectors',
    values: [
      {
        name: 'aerospace',
        label: 'Aerospace'
      },
      {
        name: 'agriculture',
        label: 'Agriculture'
      },
      {
        name: 'automotive',
        label: 'Automotive'
      },
      {
        name: 'chemical',
        label: 'Chemical'
      },
      {
        name: 'commercial',
        label: 'Commercial'
      },
      {
        name: 'communications',
        label: 'Communications'
      },
      {
        name: 'construction',
        label: 'Construction'
      },
      {
        name: 'defense',
        label: 'Defense'
      },
      {
        name: 'education',
        label: 'Education'
      },
      {
        name: 'energy',
        label: 'Energy'
      },
      {
        name: 'entertainment',
        label: 'Entertainment'
      },
      {
        name: 'financial-services',
        label: 'Financial Services'
      },
      {
        name: 'government',
        label: 'Government'
      },
      {
        name: 'emergency-services',
        label: 'Government (Emergency Services)'
      },
      {
        name: 'government-local',
        label: 'Government (Local)'
      },
      {
        name: 'government-national',
        label: 'Government (National)'
      },
      {
        name: 'government-public-services',
        label: 'Government (Public Services)'
      },
      {
        name: 'government-regional',
        label: 'Government (Regional)'
      },
      {
        name: 'healthcare',
        label: 'Healthcare'
      },
      {
        name: 'hospitality-leisure',
        label: 'Hospitality / Leisure'
      },
      {
        name: 'infrastructure',
        label: 'Infrastructure'
      },
      {
        name: 'dams',
        label: 'Infrastructure (Dams)'
      },
      {
        name: 'nuclear',
        label: 'Infrastructure (Nuclear)'
      },
      {
        name: 'water',
        label: 'Infrastructure (Water)'
      },
      {
        name: 'insurance',
        label: 'Insurance'
      },
      {
        name: 'manufacturing',
        label: 'Manufacturing'
      },
      {
        name: 'mining',
        label: 'Mining'
      },
      {
        name: 'non-profit',
        label: 'Non-Profit'
      },
      {
        name: 'pharmaceuticals',
        label: 'Pharmaceuticals'
      },
      {
        name: 'retail',
        label: 'Retail'
      },
      {
        name: 'technology',
        label: 'Technology'
      },
      {
        name: 'telecommunications',
        label: 'Telecommunications'
      },
      {
        name: 'transportation',
        label: 'Transportation'
      },
      {
        name: 'utilities',
        label: 'Utilities'
      }
    ],
    type: 'vocab'
  },
  {
    name: 'sighting_of_ref',
    label: 'Sighting Of Ref',
    type: 'string'
  },
  {
    name: 'source_name',
    label: 'Source Name',
    type: 'string'
  },
  {
    name: 'source_ref',
    label: 'Source Ref',
    type: 'string'
  },
  {
    name: 'target_ref',
    label: 'Target Ref',
    type: 'string'
  },
  {
    name: 'tlp',
    label: 'TLP',
    values: [
      {
        name: 'green',
        label: 'Green'
      },
      {
        name: 'amber',
        label: 'Amber'
      },
      {
        name: 'red',
        label: 'Red'
      },
      {
        name: 'white',
        label: 'White'
      }
    ],
    type: 'enum'
  },
  {
    name: 'value',
    label: 'Value',
    type: 'string'
  }
];
