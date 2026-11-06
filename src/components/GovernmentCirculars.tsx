import React, { useState } from 'react';
import { 
  FileText, MapPin, Calendar, DollarSign, CheckCircle2, 
  Phone, Users, ArrowRight, Printer, Calculator, Compass, 
  HelpCircle, ChevronDown, Award, Briefcase, FileCheck, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Define regional hiring data
interface CircularData {
  regionId: string;
  regionName: string;
  status: 'Active' | 'Upcoming' | 'Closed';
  circularNo: string;
  refNo: string;
  datePublished: string;
  closingDate: string;
  authorityName: string;
  authorityAddress: string;
  authorityDelivery: string;
  posts: string[];
  purpose: string;
  qualifications: string[];
  salaryScales: {
    grade: string;
    level: string;
    range: string;
    amount: number; // monthly or base
  }[];
  requirements: string[];
  contacts: { name: string; phone: string }[];
  backgroundColor: string;
  subRegions: string[];
}

const CIRCULARS: CircularData[] = [
  {
    regionId: 'central',
    regionName: 'Central Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: CD/05/2026',
    refNo: 'CDO/PERS/29/A (1)',
    datePublished: '5th June 2026',
    closingDate: '28th June, 2026',
    authorityName: 'Director of District Operations - Central Region',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 0012, Serowe',
    authorityDelivery: 'Regional Records Management Desk, Serowe or any Central Sub-district Office',
    posts: [
      'Temporary Teacher Aides (Early Childhood)',
      'Assistant Teachers (Primary)',
      'Temporary Secondary Teachers (Languages, Humanities)',
      'Special Education Teacher Assistants'
    ],
    purpose: 'To teach and perform educational duties in remote, semi-urban, or central administrative sub-districts, maintaining standard record criteria, assessing progress, and helping schools implement academic recoveries.',
    qualifications: [
      'Certificate in Early Childhood Education',
      'Diploma/Degree in Primary or Secondary Education',
      'Accredited degree with PGDE for Secondary subject specialities'
    ],
    salaryScales: [
      { grade: 'Certificate B3', level: 'P65,503.00 – P76,908.00 per annum', range: 'P65,503 - P76,908', amount: 65503 },
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Fully completed registration profile in the Ministry digital portal.',
      'Copy of Omang (certified within last 3 months).',
      'Accredited teaching credentials & transcripts verified by BQA.',
      '2 academic or work references.'
    ],
    contacts: [
      { name: 'Ms. G. Keaketswe', phone: '4630800' },
      { name: 'Mr. P. Balule', phone: '4630805' }
    ],
    backgroundColor: 'from-amber-500/10 to-orange-600/5',
    subRegions: ["Bobirwa", "Boteti", "Mahalapye", "Palapye", "Sefhare", "Selibe Phikwe", "Serowe", "Shoshong", "Tonota", "Tutume"]
  },
  {
    regionId: 'kgalagadi',
    regionName: 'Kgalagadi Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: KG/02/2026',
    refNo: 'KGO/PERS/11/B (3)',
    datePublished: '3rd June 2026',
    closingDate: '24th June, 2026',
    authorityName: 'Regional Director - Kgalagadi Operations',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 005, Tshabong',
    authorityDelivery: 'Tshabong Education Center Records Management Desk or Post Office via post',
    posts: [
      'Temporary Teacher Aides (Early Childhood)',
      'Assistant Primary Teachers (Rural Placements)',
      'Secondary Assistant Teachers'
    ],
    purpose: 'To teach and perform educational duties across remote areas in Kgalagadi sub-districts, emphasizing early child integration and primary school curriculum delivery in rural outposts.',
    qualifications: [
      'Certificate in Early Childhood Education',
      'Diploma/Degree in Primary Education with rural service interest',
      'B.Ed / PGDE in Secondary subjects'
    ],
    salaryScales: [
      { grade: 'Certificate B3', level: 'P65,503.00 – P76,908.00 per annum', range: 'P65,503 - P76,908', amount: 65503 },
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Updated CV stating major & minor teaching subjects clearly.',
      'Copy of certified identity card (Omang).',
      'Certified transcripts stamped by a recognized university registrar.',
      '2 signed reference letters.'
    ],
    contacts: [
      { name: 'Mr. K. Ntuane', phone: '5403112' }
    ],
    backgroundColor: 'from-orange-500/10 to-red-600/5',
    subRegions: ["Kgalagadi South", "Kgalagadi North"]
  },
  {
    regionId: 'south',
    regionName: 'South Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: 1 OF 2026',
    refNo: 'SRO 4/2/8 II (53)',
    datePublished: '29th May 2026',
    closingDate: '12th June, 2026',
    authorityName: 'Acting Director, Regional Operations - South Region',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 003, Kanye',
    authorityDelivery: 'Regional Education Office - Kanye at Records Management Unit or Post Office preferably Express Mail Service (EMS)',
    posts: [
      'Temporary Teacher Aides (Early Childhood)',
      'Assistant Teachers (Early Childhood)',
      'Assistant Teachers (Primary)',
      'Assistant Teachers (Secondary)'
    ],
    purpose: 'To teach students based on prescribed syllabus, supervise students, guide and counsel students, maintain records and participate in extracurricular activities.',
    qualifications: [
      'Certificate in Early Childhood Education',
      'Diploma/Degree in Early Childhood Education',
      'Diploma/Degree in Primary Education',
      'Diploma/Degree in Secondary Education or Degree in a relevant subject and a Post Graduate Diploma in Education (PGDE) in a relevant subject',
      'Diploma/Degree in Special Education with a relevant subject'
    ],
    salaryScales: [
      { grade: 'Certificate B3', level: 'P65,503.00 – P76,908.00 per annum', range: 'P65,503 - P76,908', amount: 65503 },
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Updated CV with full contact details (Cell No.) clearly stating major and minor teaching subjects.',
      'Certified copy of Identity Card (Omang).',
      'Certified copies of Certificates and Academic transcripts.',
      '2 References (not older than 6 months).',
      'NB: All applicants under Affirmative Action should attach authentic supporting documents in their application.'
    ],
    contacts: [
      { name: 'Mr. O. Makhokhoba', phone: '5447412' },
      { name: 'Mr. M. I. Motsemme', phone: '5447432' }
    ],
    backgroundColor: 'from-sky-500/10 to-sky-600/5',
    subRegions: ["Goodhope", "Kanye", "Lobatse", "Moshupa", "Jwaneng/Mabutsane"]
  },
  {
    regionId: 'gantsi',
    regionName: 'Gantsi Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: GZ/01/2026',
    refNo: 'GZO/PERS/4/A (22)',
    datePublished: '6th June 2026',
    closingDate: '30th June, 2026',
    authorityName: 'Director of District Operations - Gantsi District',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 0018, Gantsi',
    authorityDelivery: 'Gantsi Regional Education Office at Records Office or Post Office Desk',
    posts: [
      'Temporary Teacher Aides (Early Childhood)',
      'Remote Secondary Assistant Teachers',
      'Primary Specialist Teachers'
    ],
    purpose: 'To teach students and support classroom management in Gantsi and Charleshill schools, with an focus on bridging early education pathways for rural cohorts.',
    qualifications: [
      'Certificate in Early Childhood Care or Education',
      'Diploma/Degree in Primary or Secondary Pedagogy',
      'Special Education specialization'
    ],
    salaryScales: [
      { grade: 'Certificate B3', level: 'P65,503.00 – P76,908.00 per annum', range: 'P65,503 - P76,908', amount: 65503 },
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Updated CV stating teaching subject pairs.',
      'Copy of Omang (certified colors).',
      'Certified copy of transcripts and BQA credentials.',
      '2 references.'
    ],
    contacts: [
      { name: 'Ms. M. Radibe', phone: '6596110' }
    ],
    backgroundColor: 'from-emerald-500/10 to-teal-650/5',
    subRegions: ["Gantsi", "Charleshill"]
  },
  {
    regionId: 'south_east',
    regionName: 'South East Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: SE/03/2026',
    refNo: 'GRE/COMR/18/A',
    datePublished: '1st June 2026',
    closingDate: '18th June, 2026',
    authorityName: 'Regional Director - Gaborone & South East Operations',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 0042, Gaborone',
    authorityDelivery: 'Regional Records Center, Gaborone West Operations Office',
    posts: [
      'Temporary Primary School Teachers',
      'Special Education Teacher Assistants',
      'Temporary Science & Mathematics Lecturers (Secondary)'
    ],
    purpose: 'To deliver quality instruction in alignment with national curriculum standards, address local sub-district student shortfalls, and support resource-room learning pathways.',
    qualifications: [
      'Diploma or Degree in Primary/Secondary Education',
      'Degree in STEM fields with PGDE qualification',
      'Specialist training in Inclusive Education'
    ],
    salaryScales: [
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Detailed CV listing major pedagogical fields.',
      'Certified true copy of national ID (Omang).',
      'Validated transcripts issued by recognized tertiary academies.',
      'Two professional character letters of recommendation.'
    ],
    contacts: [
      { name: 'Mrs. K. Sebele', phone: '3951234' }
    ],
    backgroundColor: 'from-blue-500/10 to-indigo-650/5',
    subRegions: ["Gaborone", "South-East"]
  },
  {
    regionId: 'kgatleng',
    regionName: 'Kgatleng Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: KT/01/2026',
    refNo: 'KTO/PERS/08/II',
    datePublished: '4th June 2026',
    closingDate: '25th June, 2026',
    authorityName: 'Director of Regional Education Operations - Kgatleng',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 0011, Mochudi',
    authorityDelivery: 'Mochudi Regional Records Desk, Government Administration Offices',
    posts: [
      'Temporary Early Childhood Aides',
      'Primary General Teachers',
      'Language Teachers (Secondary)'
    ],
    purpose: 'To teach and perform educational tasks in primary and secondary capacities, managing classroom assessments and supporting schoolheads in Kgatleng.',
    qualifications: [
      'Certificate / Diploma in Early Childhood Care',
      'B.Ed / PGDE for Secondary instruction, Setswana / English subject expertise preferred'
    ],
    salaryScales: [
      { grade: 'Certificate B3', level: 'P65,503.00 – P76,908.00 per annum', range: 'P65,503 - P76,908', amount: 65503 },
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Full digital registration profile.',
      'Certified copy of Omang (within 3 months date).',
      'BQA certified educational certificates.',
      '2 academic references.'
    ],
    contacts: [
      { name: 'Mr. T. Letsamao', phone: '5777201' }
    ],
    backgroundColor: 'from-pink-500/10 to-rose-600/5',
    subRegions: ["Kgatleng"]
  },
  {
    regionId: 'north_east',
    regionName: 'North East Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: NE/02/2026',
    refNo: 'NEO/PERS/15/A',
    datePublished: '2nd June 2026',
    closingDate: '20th June, 2026',
    authorityName: 'Regional Director - North East District',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 0022, Francistown',
    authorityDelivery: 'Francistown Regional Records Unit, Government Complex Desk',
    posts: [
      'Temporary Teacher Aides (Special Needs Group)',
      'Primary Generalists',
      'Secondary Science & Practical Subjects Teachers'
    ],
    purpose: 'To supervise students and deliver learning tracks for North East district schools, filling critical science and pre-vocational subject shortfalls.',
    qualifications: [
      'Diploma/Degree in Primary or Secondary Education',
      'BQA accredited technical degrees + PGDE'
    ],
    salaryScales: [
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Detailed teacher profile with Omang certified copy.',
      'Academic transcripts stamped by the university registrar.',
      '2 signed professional references.'
    ],
    contacts: [
      { name: 'Mr. P. Balule', phone: '2413801' }
    ],
    backgroundColor: 'from-cyan-500/10 to-sky-650/5',
    subRegions: ["Francistown", "North-East"]
  },
  {
    regionId: 'kweneng',
    regionName: 'Kweneng Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: KW/04/2026',
    refNo: 'KWO/PERS/12/IV',
    datePublished: '4th June 2026',
    closingDate: '27th June, 2026',
    authorityName: 'Director of Regional Operations - Kweneng',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 007, Molepolole',
    authorityDelivery: 'Molepolole Regional Education Office, Records Management Desk',
    posts: [
      'Temporary Early Childhood Support Staff',
      'Primary Assistant Teachers',
      'Secondary Language & Humanities Teachers'
    ],
    purpose: 'To execute teacher operations in Kweneng district, managing large class cohorts and delivering remedial teaching support.',
    qualifications: [
      'Certificate in ECE or basic pedagogy',
      'Diploma/Degree in Primary or Secondary subjects'
    ],
    salaryScales: [
      { grade: 'Certificate B3', level: 'P65,503.00 – P76,908.00 per annum', range: 'P65,503 - P76,908', amount: 65503 },
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Completed digital submission.',
      'Certified color image of Omang card.',
      'BQA verified transcripts.',
      '2 recommendations.'
    ],
    contacts: [
      { name: 'Mr. J. Molale', phone: '5920381' }
    ],
    backgroundColor: 'from-violet-500/10 to-fuchsia-600/5',
    subRegions: ["Lentsweletau", "Letlhakeng", "Molepolole", "Mogoditshane/Thamaga"]
  },
  {
    regionId: 'chobe',
    regionName: 'Chobe Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: CH/01/2026',
    refNo: 'CHO/PERS/02/B',
    datePublished: '3rd June 2026',
    closingDate: '22th June, 2026',
    authorityName: 'Sub-Regional Coordinator - Chobe',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 009, Kasane',
    authorityDelivery: 'Kasane Regional Education Records Desk, Post Office Building',
    posts: [
      'Temporary Early Childhood Aides',
      'Primary Teachers (All Subjects)',
      'Secondary Assistant Teachers'
    ],
    purpose: 'To teach and perform educational duties in the Chobe sub-region, tracking child development targets and supporting cross-curricular programs.',
    qualifications: [
      'Certificate/Diploma in Early Childhood Education',
      'Diploma/Degree in Primary or Secondary teaching'
    ],
    salaryScales: [
      { grade: 'Certificate B3', level: 'P65,503.00 – P76,908.00 per annum', range: 'P65,503 - P76,908', amount: 65503 },
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Ministry digital registration entry.',
      'Omang color certified copy.',
      'Academic transcripts stamped and BQA evaluations attached.',
      '2 letters of reference.'
    ],
    contacts: [
      { name: 'Ms. S. Phiri', phone: '6250210' }
    ],
    backgroundColor: 'from-purple-500/10 to-indigo-600/5',
    subRegions: ["Chobe"]
  },
  {
    regionId: 'north_west',
    regionName: 'North West Region',
    status: 'Active',
    circularNo: 'VACANCY CIRCULAR NO: NW/03/2026',
    refNo: 'NWO/PERS/33/A',
    datePublished: '5th June 2026',
    closingDate: '26th June, 2026',
    authorityName: 'Regional Operations Director - North West Region',
    authorityAddress: 'Ministry of Child Welfare and Basic Education, Private Bag 0015, Maun',
    authorityDelivery: 'Maun Regional Records Unit or local Sub-District offices',
    posts: [
      'Temporary Teacher Aides (Early Childhood development)',
      'Primary Generalists',
      'Secondary Assistant Language & Science Instructors'
    ],
    purpose: 'To provide teacher reinforcements across Ngamiland-Chobe operations, ensuring standard classroom coverages and high performance scoring in North West schools.',
    qualifications: [
      'Certificate in ECE or basic pedagogy',
      'Diploma/Degree in Primary or Secondary fields'
    ],
    salaryScales: [
      { grade: 'Certificate B3', level: 'P65,503.00 – P76,908.00 per annum', range: 'P65,503 - P76,908', amount: 65503 },
      { grade: 'Diploma C4', level: 'P108,444.00 – P123,420.00 per annum', range: 'P108,444 - P123,420', amount: 108444 },
      { grade: 'Degree C3', level: 'P127,092.00 – P150,852.00 per annum', range: 'P127,092 - P150,852', amount: 127092 }
    ],
    requirements: [
      'Certified true copy of Omang issued within last 90 days.',
      'CV clearly highlighting majors and minors.',
      'Certified transcripts.',
      '2 academic references.'
    ],
    contacts: [
      { name: 'Mr. D. Molefe', phone: '6860341' }
    ],
    backgroundColor: 'from-teal-500/10 to-emerald-600/5',
    subRegions: ["Gumare", "Maun", "Shakawe"]
  }
];

export default function GovernmentCirculars() {
  const [activeRegion, setActiveRegion] = useState<string>('south');
  const [activeSubRegion, setActiveSubRegion] = useState<string>('Kanye');
  const [expandedSection, setExpandedSection] = useState<string | null>('purpose');
  
  // Interactive Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    cv: false,
    omang: false,
    certs: false,
    refs: false,
  });

  // Salary Calculator State
  const [calcTier, setCalcTier] = useState<string>('Degree');
  const [calcRegionAdjust, setCalcRegionAdjust] = useState<boolean>(true); // allowance for remote placements

  const currentCircular = CIRCULARS.find(c => c.regionId === activeRegion) || CIRCULARS[2];

  // Calculate dynamic estimations based on qualifications in the active circular
  const getCalculatedPay = () => {
    let base = 127092; // degree
    let grade = 'C3';
    let label = 'Degree level teaching officer';

    if (calcTier === 'Certificate') {
      base = 65503;
      grade = 'B3';
      label = 'Certificate / Teacher Aide post';
    } else if (calcTier === 'Diploma') {
      base = 108444;
      grade = 'C4';
      label = 'Diploma level professional';
    } else if (calcTier === 'Postgraduate') {
      base = 138000; // PGDE premium
      grade = 'C3 + Allowance';
      label = 'Senior secondary or expert subject specialist';
    }

    const monthlyBase = Math.round(base / 12);
    // 10% Remote Area Service Allowance (RASA) is standard in some Botswana sectors
    const remoteAllowance = calcRegionAdjust ? Math.round(monthlyBase * 0.12) : 0; 
    const medicalAllowance = 120; // standard gov aid
    const totalMonthly = monthlyBase + remoteAllowance + medicalAllowance;

    return {
      annualBase: base,
      monthlyBase,
      grade,
      remoteAllowance,
      totalMonthly,
      label
    };
  };

  const payInfo = getCalculatedPay();

  const toggleChecklist = (id: string) => {
    setChecklist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const checklistTotal = Object.values(checklist).filter(Boolean).length;
  const checklistPercent = (checklistTotal / 4) * 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="hiring-regions-circular" className="relative w-full rounded-3xl bg-slate-900 border border-slate-200/10 dark:border-slate-800 text-slate-100 p-6 md:p-10 overflow-hidden shadow-2xl mt-12 mb-12">
      {/* Visual Ambient Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="relative z-10">
        {/* Title & Badge Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 font-bold text-xs uppercase tracking-widest border border-sky-500/20 mb-3.5">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Active Recruitment Campaign
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white mb-2.5">
              Government Hiring Regions
            </h2>
            <p className="text-slate-300 max-w-2xl text-base leading-relaxed">
              Official Ministry of Child Welfare and Basic Education circulars. Review credentials, estimated salary tiers, and certified document prerequisites. Log in to submit directly online.
            </p>
          </div>
          
          {/* Print/Share */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Circular
            </button>
            <button 
              onClick={() => alert(`Copied government link: ${window.location.origin}/#hiring-regions-circular`)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>

        {/* Region Tabs Selection Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {CIRCULARS.map((region) => {
            const isActive = region.regionId === activeRegion;
            return (
              <button
                key={region.regionId}
                onClick={() => {
                  setActiveRegion(region.regionId);
                  if (region.subRegions && region.subRegions.length > 0) {
                    setActiveSubRegion(region.subRegions[0]);
                  }
                  setExpandedSection('purpose');
                }}
                className={`relative overflow-hidden text-left p-3.5 rounded-2xl transition-all duration-300 border ${
                  isActive 
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/20' 
                    : 'bg-slate-950/40 hover:bg-slate-800/40 border-slate-800/60 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-sky-400 rounded-bl-xl"></div>
                )}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[9px] font-bold leading-none px-1.5 py-0.5 rounded-full ${
                    region.status === 'Active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {region.status}
                  </span>
                  <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                </div>
                <h4 className="text-xs font-black text-slate-105 block truncate transition-colors">{region.regionName}</h4>
                <p className="text-[9px] mt-0.5 font-mono text-slate-400 truncate">{region.circularNo.split('NO: ')[1] || region.circularNo}</p>
              </button>
            );
          })}
        </div>

        {/* Sub-Regions Pills Display */}
        <div className="bg-slate-950/50 rounded-2xl border border-slate-800/85 p-4 mb-8">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" /> Active Recruitment Scope for Sub-Regions inside {currentCircular.regionName}:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentCircular.subRegions.map((subReg) => {
              const isSubActive = activeSubRegion === subReg;
              return (
                <button
                  key={subReg}
                  onClick={() => setActiveSubRegion(subReg)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    isSubActive
                      ? 'bg-sky-500/20 border-sky-400/60 text-sky-305 ring-1 ring-sky-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {subReg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Major Board Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Circular Document View */}
          <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 via-sky-400 to-indigo-500"></div>
            
            {/* Gov Seal & Header */}
            <div className="border-b border-dashed border-slate-800 pb-5 mb-5 select-none">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/de/Coat_of_arms_of_Botswana.svg"
                  alt="Republic of Botswana Seal"
                  className="w-16 h-16 object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                    Official Advertisement
                  </span>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide mt-1.5">
                    Republic of Botswana
                  </h3>
                  <p className="text-xs text-sky-400 font-bold uppercase tracking-snug">
                    Ministry of Child Welfare and Basic Education
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {currentCircular.regionName} Operations • {activeSubRegion ? `${activeSubRegion} Sub-region` : currentCircular.authorityAddress.split(',')[2] || 'Botswana'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase font-sans font-bold">CIRCULAR NO:</span>
                  <span className="text-slate-200 font-bold">{currentCircular.circularNo.split('NO: ')[1] || '1 OF 2026'}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase font-sans font-bold">REF NUMBER:</span>
                  <span className="text-slate-200">{currentCircular.refNo}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase font-sans font-bold">Published:</span>
                  <span className="text-emerald-400 font-bold">{currentCircular.datePublished}</span>
                </div>
              </div>
            </div>

            {/* Content Body of Circular */}
            <div className="space-y-4">
              
              {/* Urgent Action Banner */}
              <div className="p-3.5 rounded-2xl bg-yellow-500/5 text-yellow-600 dark:text-yellow-405 border border-yellow-500/10 text-xs flex gap-2.5">
                <Calendar className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">Submission Deadline: {currentCircular.closingDate}</span>
                  <span className="text-slate-400 font-medium leading-normal">
                    Applicants must register and compile credentials before closing to allow regional shortlisting operations.
                  </span>
                </div>
              </div>

              {/* POSTS AVAILABLE */}
              <div>
                <h4 className="text-xs font-bold text-slate-405 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-sky-400" /> Authorized Positions Under Campaign
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentCircular.posts.map((post, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-200 line-clamp-1">{post}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collapsible Accordion Tabs for Full Circular compliance details */}
              <div className="mt-6 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                
                {/* Purpose of the Job */}
                <div>
                  <button 
                    onClick={() => setExpandedSection(expandedSection === 'purpose' ? null : 'purpose')}
                    className="w-full flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <Compass className="w-4 h-4 text-sky-400" /> Main Purpose of the Job
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform ${expandedSection === 'purpose' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSection === 'purpose' && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-slate-900/10"
                      >
                        <p className="p-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800/50">
                          {currentCircular.purpose}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Qualifications */}
                <div>
                  <button 
                    onClick={() => setExpandedSection(expandedSection === 'qualifications' ? null : 'qualifications')}
                    className="w-full flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <Award className="w-4 h-4 text-sky-400" /> Academic Qualifications Required
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform ${expandedSection === 'qualifications' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSection === 'qualifications' && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-slate-900/10"
                      >
                        <div className="p-4 space-y-2 text-slate-300 text-sm border-t border-slate-800/50">
                          <p className="text-xs text-slate-400 mb-2">Qualifications must align with Botswana Qualifications Authority (BQA) evaluation guidelines:</p>
                          {currentCircular.qualifications.map((qual, i) => (
                            <div key={i} className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                              <span className="text-xs leading-relaxed font-semibold text-slate-200">{qual}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Requirements / Attachments */}
                <div>
                  <button 
                    onClick={() => setExpandedSection(expandedSection === 'requirements' ? null : 'requirements')}
                    className="w-full flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-sky-400" /> Key Submission Requirements
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform ${expandedSection === 'requirements' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSection === 'requirements' && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-slate-900/10"
                      >
                        <div className="p-4 space-y-2.5 text-slate-300 text-sm border-t border-slate-800/50">
                          {currentCircular.requirements.map((req, i) => (
                            <div key={i} className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                              <span className="text-xs leading-relaxed text-slate-200">{req}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submissions & Addressing */}
                <div>
                  <button 
                    onClick={() => setExpandedSection(expandedSection === 'addressing' ? null : 'addressing')}
                    className="w-full flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900 text-left transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sky-400" /> How to Address & Deliver Physical Portfolios
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform ${expandedSection === 'addressing' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSection === 'addressing' && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-slate-900/10"
                      >
                        <div className="p-4 text-xs space-y-3 text-slate-300 border-t border-slate-800/50 leading-relaxed">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Addressed to:</span>
                            <p className="font-extrabold text-slate-100">{currentCircular.authorityName}</p>
                            <p className="text-slate-300">{currentCircular.authorityAddress}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Physical Delivery Address:</span>
                            <p className="text-slate-300 font-semibold">{currentCircular.authorityDelivery}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Ministry Stamps / Authenticated Contacts Footer in document */}
              <div className="pt-4 border-t border-slate-900 mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <div>
                    <span className="block text-[8px] font-bold text-slate-500 uppercase">Contact Enquiries:</span>
                    <span className="font-bold text-slate-350">
                      {currentCircular.contacts.map((c, idx) => (
                        <span key={idx}>
                          {c.name} ({c.phone}){idx < currentCircular.contacts.length - 1 ? ' or ' : ''}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                <div className="p-2 border border-sky-500/20 bg-sky-500/5 rounded-xl flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase text-indigo-300">MCWBE Digital Registration Channel</p>
                    <p className="text-[8px] text-slate-400">Apply instantly online to avoid record loss the electronic way!</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL: Interactive Candidate Aids (Checklist & Salary Estimator) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. DOCUMENT CHECKLIST ENGINE */}
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 blur-xl rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-sky-400" />
                <h4 className="font-extrabold text-sm text-slate-100 uppercase tracking-wide">Candidate Checklist</h4>
              </div>
              <p className="text-xs text-slate-400 leading-normal mb-4">
                Before applying, verify you have certified copies of all elements requested under <strong>{currentCircular.refNo}</strong>:
              </p>

              <div className="space-y-2.5">
                {[
                  { id: 'cv', t: 'Certified & Updated CV', d: 'Stating major & minor teaching subjects clearly with contact details.' },
                  { id: 'omang', t: 'Valid Identity Card (Omang)', d: 'Certified color copy within last three (3) calendar months.' },
                  { id: 'certs', t: 'Tertiary Transcripts & Diplomas', d: 'With official university/college registrar stamps & accredited seals.' },
                  { id: 'refs', t: '2x Professional Character References', d: 'Both signed and dated from authorized persons within last 6 months.' }
                ].map((item) => (
                  <label 
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      checklist[item.id] 
                        ? 'bg-sky-500/10 border-sky-500/40' 
                        : 'bg-slate-900 shadow-sm border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={checklist[item.id] || false}
                      onChange={() => toggleChecklist(item.id)}
                      className="mt-1 h-4.5 w-4.5 rounded border-slate-800 text-sky-500 focus:ring-0 cursor-pointer bg-slate-950 focus:outline-none"
                    />
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-extrabold ${checklist[item.id] ? 'text-sky-300' : 'text-slate-200'}`}>
                        {item.t}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-snug mt-0.5">{item.d}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="mt-4 pt-3.5 border-t border-slate-900">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5">
                  <span>Prerequisite Readiness</span>
                  <span className={checklistTotal === 4 ? 'text-emerald-400' : 'text-sky-400'}>
                    {checklistTotal}/4 Items Ready ({Math.round(checklistPercent)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${checklistTotal === 4 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                    style={{ width: `${checklistPercent}%` }}
                  />
                </div>
                {checklistTotal === 4 ? (
                  <div className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-xl text-[11px] font-bold mt-3 text-center">
                    ✓ Ready to submit! Use our Ministry Portal to apply online.
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 mt-2 text-center">
                    Check the remaining items to verify compliance.
                  </p>
                )}
              </div>
            </div>

            {/* 2. LIVE SALARY & ALLOWANCE ESTIMATOR */}
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl rounded-full pointer-events-none"></div>

              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-5 h-5 text-sky-400" />
                <h4 className="font-extrabold text-sm text-slate-100 uppercase tracking-wide">MCWBE Pay Tier Estimator</h4>
              </div>
              <p className="text-xs text-slate-400 leading-normal mb-4">
                Calculate governing Botswana Civil Service salary bracket based on the qualification criteria:
              </p>

              <div className="space-y-4">
                {/* Qualification Tier */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-2">My Current Qualification</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Certificate', 'Diploma', 'Degree', 'Postgraduate'].map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setCalcTier(tier)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all ${
                          calcTier === tier 
                            ? 'bg-sky-600 border-sky-400 text-white shadow-md' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-350'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remote Allowance Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-205 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" /> Regional Remote Allowance (RASA)
                    </span>
                    <p className="text-[9px] text-slate-400 mt-0.5">+12% Area Supplement</p>
                  </div>
                  <button
                    onClick={() => setCalcRegionAdjust(!calcRegionAdjust)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      calcRegionAdjust ? 'bg-sky-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      calcRegionAdjust ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Calculation Outputs */}
                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Base Grade Bracket:</span>
                    <span className="font-mono text-slate-100 font-extrabold uppercase py-0.5 px-2 bg-slate-950 rounded border border-slate-800">
                      Scale {payInfo.grade}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 text-[11px] leading-tight pb-1.5 border-b border-slate-900">
                    <span>Category:</span>
                    <span className="font-semibold text-slate-300 truncate">{payInfo.label}</span>
                  </div>

                  <div className="pt-1.5 flex justify-between items-center text-slate-400 font-mono">
                    <span>Base Annual Range:</span>
                    <span className="font-bold text-slate-200 font-sans">
                      P{payInfo.annualBase.toLocaleString()}.00 /yr
                    </span>
                  </div>

                  {calcRegionAdjust && (
                    <div className="flex justify-between items-center text-slate-1000">
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-sans">RASA Remote Supplement:</span>
                      <span className="font-bold text-emerald-450 font-mono">+P{payInfo.remoteAllowance.toLocaleString()}.00</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-900 flex justify-between items-end">
                    <div>
                      <span className="block text-[9px] font-black uppercase text-slate-500 leading-none">Est. Monthly Gross Salary</span>
                      <span className="text-[10px] text-slate-400 font-sans italic">Pula currency standard</span>
                    </div>
                    <span className="text-xl font-black text-sky-450 tracking-tight font-mono">
                      P{(payInfo.totalMonthly).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 text-center leading-normal">
                  *Disclaimer: Estimations based on 2026 Botswana Public Service directives. Actual offers depend on final assessment by Kanye or specific sub-district authorities.
                </div>
              </div>
            </div>

            {/* Direct Action */}
            <div className="p-4 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 rounded-3xl text-center shadow-lg hover:shadow-sky-500/20 active:scale-[0.99] transition-all border border-sky-400/20">
              <span className="text-[10px] font-semibold text-sky-100 tracking-wider uppercase block mb-1">Digitize My Application</span>
              <p className="text-xs text-white mb-3.5 px-4">
                Submit documents, input credentials, and track recruitment progress in real-time.
              </p>
              <button
                onClick={() => {
                  const targetBtn = document.querySelector('#quick-sign-in-btn') || document.querySelector('button');
                  if (targetBtn) {
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                     // Click first button which opens login flow if not authenticated
                     (targetBtn as HTMLButtonElement).click();
                  }
                }}
                className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-extrabold py-2.5 rounded-2xl flex items-center justify-center gap-1 border border-slate-800"
              >
                Get Started ➔
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
