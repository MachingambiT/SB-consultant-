export interface Service {
  id: string;
  title: string;
  price: string;
  description: string;
}

export const services: Service[] = [
  {
    id: "pvt-company",
    title: "Private Limited Company Registration",
    price: "$130",
    description: "Includes FREE Tax Clearance Assistance."
  },
  {
    id: "pbc",
    title: "PBC Registration",
    price: "$90",
    description: "Includes FREE Tax Clearance Assistance."
  },
  {
    id: "re-registration",
    title: "Company Re-registration",
    price: "$70",
    description: "Takes 1-2 Working Days."
  },
  {
    id: "tax-clearance",
    title: "Tax Clearance Registration",
    price: "$30",
    description: "Fast processing for tax clearance."
  },
  {
    id: "nssa",
    title: "NSSA Registration",
    price: "$30",
    description: "Ensure your compliance with NSSA."
  },
  {
    id: "annual-returns",
    title: "Annual Returns Filing",
    price: "$30",
    description: "Timely filing of your company's annual returns."
  },
  {
    id: "vendor",
    title: "Vendor Registration",
    price: "From $250",
    description: "Registration for vendor compliance."
  },
  {
    id: "praz",
    title: "PRAZ Registration",
    price: "From $120",
    description: "Public Procurement and Disposal of Public Assets Authority registration."
  },
  {
    id: "change-details",
    title: "Change of Directors / Details",
    price: "From $50",
    description: "Update company details seamlessly."
  },
  {
    id: "cr6-cr14",
    title: "CR6 & CR14 Processing",
    price: "From $55",
    description: "Processing for CR6 and CR14 forms."
  },
  {
    id: "consultancy",
    title: "Business Consultancy & Advisory",
    price: "From $20",
    description: "Professional advice for your business."
  }
];
