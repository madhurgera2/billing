window.BILLING_CONFIG = {
  app: {
    title: "Hari Traders",
    subtitle:
      "Deals in all kind of Electronics and Furniture."
  },
  invoice: {
    title: "TAX INVOICE",
    topNotice:
      "(This copy does not entitle the holder to claim Input Tax Credit.)",
    copyType: "Original Copy",
    currencySymbol: "INR",
    quantityUnitLabel: "Pcs.",
    companyStateCode: "06",
    signatureLabel: "Authorised Signatory",
    receiverLabel: "Receiver's Signature",
    termsTitle: "Terms & Conditions"
  },
  seller: {
    name: "Hari Traders",
    addressLines: [
      "308, 8 Marla colony, patel Nagar, Hisar"
    ],
    phoneLine: "Tel. : 9215889997",
    emailLine: "E-mail : narendergera4@gmail.com",
    gstin: "06AOEPK4591E1Z0"
  },
  bank: {
    bankName: "HDFC Bank",
    branch: "15 Sec Hisar",
    ifsc: "HDFC0007462",
    accountNumber: "50200096448306"
  },
  compliance: {
    jurisdictionLine: "All dispute subject to Hisar jurisdiction only.",
    declaration:
      "Guaranty / Warranty should be claim from company"
  },
  defaults: {
    invoiceNo: "R2026-27/number",
    invoiceDate: "2026-04-24",
    placeOfSupply: "Haryana",
    reverseCharge: "NA",
    deliveryNote: "",
    dispatchInfo: "",
    billedToName: "",
    billedToAddress: "",
    billedToGstin: "",
    shippedToName: "",
    shippedToAddress: "",
    shippedToGstin: "",
    declarationText: "Guaranty / Warranty should be claim from company",
    remarkText: "Tax and totals are auto-calculated from the selected products."
  },
  terms: [
    "Goods sold will not be taken back.",
    "Interest @ 15% p.a. will be charged if payment is not made in time.",
    "All warranty / guarantee belongs to the manufacturer.",
    "All dispute subject to Hisar jurisdiction only."
  ],
  products: [
    {
      id: "air-cooler",
      name: "Air Cooler",
      descriptionLines: [
        ""
      ],
      hsn: "84796000",
      unit: "Pcs.",
      gstPercent: 18,
      defaultRate: 10500,
      defaultDiscount: 0
    },
    {
      id: "stand",
      name: "Cooler Stand",
      descriptionLines: [
        ""
      ],
      hsn: "73089090",
      unit: "Pcs.",
      gstPercent: 18,
      defaultRate: 800,
      defaultDiscount: 0
    },
    {
      id: "almirah",
      name: "Almirah",
      descriptionLines: [
        ""
      ],
      hsn: "8479",
      unit: "Pcs.",
      gstPercent: 18,
      defaultRate: 10500,
      defaultDiscount: 0
    },
    {
      id: "tomashi-cooler-tr",
      name: "Tomashti Cooler",
      descriptionLines: [
        "THR 120",
        "THI 200/26012007",
        "1 YEAR MOTOR WARRANTY",
        "5 YEAR BODY WARRANTY"
      ],
      hsn: "8479",
      unit: "Pcs.",
      gstPercent: 18,
      defaultRate: 10500,
      defaultDiscount: 0
    },
    {
      id: "desert-cooler-max",
      name: "Desert Cooler Max",
      descriptionLines: [
        "Heavy cooling model",
        "Copper motor",
        "1 YEAR MOTOR WARRANTY"
      ],
      hsn: "8479",
      unit: "Pcs.",
      gstPercent: 18,
      defaultRate: 12500,
      defaultDiscount: 0
    },
    {
      id: "steel-almirah-3-door",
      name: "Steel Almirah 3 Door",
      descriptionLines: [
        "Powder coated finish",
        "Mirror door",
        "Lock and key set"
      ],
      hsn: "9403",
      unit: "Nos.",
      gstPercent: 18,
      defaultRate: 14900,
      defaultDiscount: 0
    }
  ],
  initialItems: [
    {
      productId: "tomashi-cooler-tr",
      quantity: 1,
      rate: 10500,
      discount: 0
    }
  ]
};
