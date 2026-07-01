/**
 * Class-wise syllabus data (verified source) — 30 combinations
 * (Classes 1-10 x FIA/CIA/AIA). Each class has age band, level, theme, a focus
 * rationale, why/avoid notes, and 5 units of detailed topics.
 *
 * Generated from the verified syllabus source. Kept as data (not JSX) so it's
 * easy to edit and could later be served from the database/CMS.
 */

export type SubjectKey = "FIA" | "CIA" | "AIA";

export type SyllabusUnit = {
  n: string;
  t: string;
  topics: string[];
};

export type SyllabusClass = {
  cls: number;
  age: string;
  level: string;
  theme: string;
  focus: string;
  why: string;
  avoid: string;
  units: SyllabusUnit[];
};

export const SUBJECT_META: Record<SubjectKey, { name: string; short: string }> = {
  FIA: { name: "Financial Intelligence", short: "FIA" },
  CIA: { name: "Cyber Intelligence", short: "CIA" },
  AIA: { name: "Artificial Intelligence", short: "AIA" },
};

export const SUBJECT_ORDER: SubjectKey[] = ["FIA", "CIA", "AIA"];
export const CLASS_ORDER = Array.from({ length: 10 }, (_, i) => i + 1);

export function tierForClass(cls: number): string {
  if (cls <= 2) return "Foundational";
  if (cls <= 5) return "Elementary";
  if (cls <= 8) return "Intermediate";
  return "Advanced";
}

export const SYLLABUS: Record<SubjectKey, SyllabusClass[]> = {
  "FIA": [
    {
      "cls": 1,
      "age": "6–7 yrs",
      "level": "Foundational",
      "theme": "Money Around Me",
      "focus": "At age 6–7, children can identify physical objects they see daily. The syllabus uses real coins, notes, and everyday shopping examples — no abstract concepts, no fractions, no percentages.",
      "why": "Children this age learn through touch, sight and stories. Money is tangible — they see it daily. This age builds the habit of recognising money and its purpose.",
      "avoid": "Avoid: interest rates, percentages, digital banking, inflation — all too abstract for 6-year-olds.",
      "units": [
        {
          "n": "Unit 1",
          "t": "What is Money?",
          "topics": [
            "Coins and notes — what they look like",
            "Difference between a coin and a note",
            "Values: 1 Re, 2 Rs, 5 Rs, 10 Rs coins",
            "10 Rs, 20 Rs, 50 Rs, 100 Rs notes",
            "Money is used to buy things we need"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Needs vs Wants",
          "topics": [
            "Needs = must have (food, water, clothes, medicine)",
            "Wants = nice to have (toys, chocolates, games)",
            "Sorting items into needs and wants",
            "Why we buy needs before wants",
            "Simple family examples from daily life"
          ]
        },
        {
          "n": "Unit 3",
          "t": "How People Earn",
          "topics": [
            "Farmers grow food and earn money by selling",
            "Teachers teach and get salary",
            "Shopkeepers sell and earn profit",
            "Doctors treat patients and charge fees",
            "All work is respected and valuable"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Spending Wisely",
          "topics": [
            "Think before buying",
            "Not everything we want should be bought",
            "Comparing two things and choosing useful one",
            "Saying no to unnecessary purchases",
            "Asking parents before spending"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Saving in a Piggy Bank",
          "topics": [
            "What saving means",
            "Why we save — for later use",
            "A piggy bank is for storing coins at home",
            "Saving daily adds up to a big amount",
            "Develop the habit of saving every day"
          ]
        }
      ]
    },
    {
      "cls": 2,
      "age": "7–8 yrs",
      "level": "Foundational",
      "theme": "My Money Habits",
      "focus": "Class 2 builds on recognition — now children can add small numbers and understand simple transactions. Real-life role play (shopkeeper, buyer) makes it concrete and fun.",
      "why": "7–8 year olds can do simple addition and subtraction. They understand 'giving money and getting change' from real experience.",
      "avoid": "Avoid: bank accounts, percentage discounts, complex budgeting — not yet developmentally appropriate.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Currency of India",
          "topics": [
            "Indian Rupee (₹) is our currency symbol",
            "All coins from 50 paise to ₹10",
            "All notes from ₹10 to ₹200",
            "How to count money using different coins",
            "100 paise = 1 Rupee"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Buying and Selling",
          "topics": [
            "Shopkeeper sells, customer buys",
            "Exchange of money for goods",
            "Simple bill: price of item + total",
            "What is change — getting back extra money",
            "Role of market, shop, and cart sellers"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Strong and Weak Choices",
          "topics": [
            "Spending on useful things = smart choice",
            "Spending on junk = wasteful choice",
            "Real examples: water bottle vs candy",
            "Thinking before opening wallet",
            "Respect for money earned by parents"
          ]
        },
        {
          "n": "Unit 4",
          "t": "My Saving Goal",
          "topics": [
            "Setting a small saving goal (e.g. a book)",
            "How many days to save to reach goal",
            "Tracking savings in a notebook or chart",
            "Feeling proud when goal is reached",
            "Saving for something meaningful"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Giving and Sharing",
          "topics": [
            "Donating some money to those in need",
            "Sharing with siblings and friends",
            "Why generosity is a financial value",
            "Putting aside a little for others",
            "Money and kindness together"
          ]
        }
      ]
    },
    {
      "cls": 3,
      "age": "8–9 yrs",
      "level": "Elementary",
      "theme": "Family Finances",
      "focus": "Class 3 children understand family context. They can relate to household expenses, parents going to work, and monthly bills. Introduction of budget concept as 'planning how to use money'.",
      "why": "8–9 year olds observe home expenses and understand time (weekly, monthly). They can grasp that money is limited and must be planned.",
      "avoid": "Avoid: interest calculations, investment types, tax — too abstract. Stick to observable home-level finance.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Family Income",
          "topics": [
            "Salary — monthly pay for a job",
            "Business income — shopkeeper, contractor",
            "Farming income — crops sold in market",
            "Why income varies from family to family",
            "All types of income are equally dignified"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Household Expenses",
          "topics": [
            "Rent, groceries, electricity, school fees",
            "Fixed expenses (same every month)",
            "Variable expenses (change each month)",
            "Why some months feel tighter than others",
            "Observing a simple monthly expense list"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Simple Family Budget",
          "topics": [
            "Budget = plan for how to use money",
            "Income minus expenses = what is left",
            "Why planning avoids running out of money",
            "Saving from leftover amount",
            "Family discussion around budget (age-appropriate)"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Banks and Post Offices",
          "topics": [
            "Banks keep our money safe",
            "Post office also offers saving accounts",
            "Passbook — shows money in and out",
            "ATM — machine that gives us our own money",
            "Why keeping money in bank is safer than home"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Saving Resources",
          "topics": [
            "Not wasting food, water, electricity",
            "Saving resources = saving money indirectly",
            "Switching off lights and fans when not needed",
            "Finishing food on plate",
            "Small savings at home add up over a year"
          ]
        }
      ]
    },
    {
      "cls": 4,
      "age": "9–10 yrs",
      "level": "Elementary",
      "theme": "Banking Basics",
      "focus": "Class 4 children are ready for structured institutional knowledge. They can understand how a bank works, what a savings account means, and what interest is — using simple numerical examples.",
      "why": "9–10 year olds can do basic multiplication. Simple interest ('100 Rs at 5% gives 5 Rs') is now understandable with real examples.",
      "avoid": "Avoid: compound interest formula, cheques, NEFT, investment risk — still too advanced.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Why Banks Exist",
          "topics": [
            "Banks keep our money safe and available",
            "History: before banks, people hid money at home",
            "Banks are trusted by government (RBI)",
            "Banks in India — SBI, PNB, Bank of Maharashtra",
            "Government-run vs private banks (simple distinction)"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Savings Account",
          "topics": [
            "Opening a savings account with a bank",
            "Depositing money — putting money in",
            "Withdrawing money — taking money out",
            "Passbook entries — record of transactions",
            "Minimum balance — amount that must stay in"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Simple Interest (Intro)",
          "topics": [
            "Interest = reward for keeping money in bank",
            "More money kept = more interest earned",
            "Simple interest example: ₹1,000 at 5% = ₹50/year",
            "Bank also lends money and charges interest",
            "Interest makes saving worthwhile"
          ]
        },
        {
          "n": "Unit 4",
          "t": "ATM and Digital Basics",
          "topics": [
            "ATM card — used to withdraw cash",
            "PIN — secret number to protect ATM card",
            "Never share ATM PIN with anyone",
            "QR code payments — scanning for paying",
            "UPI concept at a basic introductory level"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Jan Dhan Yojana",
          "topics": [
            "Government's scheme for banking for all",
            "Even poor families can open bank accounts",
            "Benefits: insurance, overdraft facility",
            "Why financial inclusion matters for India",
            "Role of government in protecting money"
          ]
        }
      ]
    },
    {
      "cls": 5,
      "age": "10–11 yrs",
      "level": "Elementary",
      "theme": "Smart Earning & Spending",
      "focus": "Class 5 children can now think abstractly about earning and spending. They understand price comparison, discounts, and the concept that money can grow or shrink based on decisions.",
      "why": "10–11 year olds are more independent and make small purchase decisions. They understand percentage discounts and comparison shopping from real experience.",
      "avoid": "Avoid: stock market, mutual funds, EMIs, home loans — still not age-relevant.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Sources of Income",
          "topics": [
            "Active income: you work, you earn (salary, business)",
            "Passive income: money earns for you (rent, interest)",
            "Why having multiple income sources is smart",
            "Different careers and their income types",
            "Why education leads to better income opportunities"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Making a Budget",
          "topics": [
            "Income – Expenses = Savings",
            "Categorising expenses: food, rent, school, fun",
            "Why some families save more than others",
            "Budgeting for a class trip or birthday",
            "Practice: make a weekly pocket money budget"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Assets and Liabilities (Simple)",
          "topics": [
            "Asset = something that earns or keeps value (land, FD)",
            "Liability = something that costs money (loan)",
            "House as asset (when owned) or liability (when rented)",
            "Simple real-life examples a child can observe",
            "Why growing assets and reducing liabilities matters"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Price, Value and Discounts",
          "topics": [
            "MRP — Maximum Retail Price — cannot be charged more",
            "Discount: 20% off means you save 20 paise per rupee",
            "Comparing prices in two shops before buying",
            "Online vs offline — which is cheaper and why",
            "Being a smart consumer: read labels, check MRP"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Digital Payments (Introduction)",
          "topics": [
            "UPI — Unified Payments Interface",
            "How UPI works: bank account linked to mobile",
            "QR code: scan to pay",
            "PayTM, Google Pay, PhonePe — common UPI apps",
            "Always check amount before confirming payment"
          ]
        }
      ]
    },
    {
      "cls": 6,
      "age": "11–12 yrs",
      "level": "Intermediate",
      "theme": "Banking & Financial Systems",
      "focus": "Class 6 students can now handle institutional banking knowledge — types of accounts, how interest works numerically, and the concept of borrowing. They understand systems beyond their family.",
      "why": "11–12 year olds can understand percentages, basic algebra, and institutional structures. Banking becomes relevant as they begin to think about future education.",
      "avoid": "Avoid: derivatives, mutual fund NAV, complex tax calculations — still too technical.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Types of Bank Accounts",
          "topics": [
            "Savings account — for individuals, earns interest",
            "Current account — for businesses, no interest",
            "Fixed deposit — locked for a period, higher interest",
            "Recurring deposit — monthly saving scheme",
            "Which account is right for which purpose"
          ]
        },
        {
          "n": "Unit 2",
          "t": "How Interest Works",
          "topics": [
            "Simple interest formula: SI = P×R×T/100",
            "Compound interest — interest on interest concept",
            "Why FD gives more than savings account",
            "How banks use our money to give loans",
            "Real example: ₹10,000 at 7% for 2 years"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Loans and EMIs",
          "topics": [
            "Why people take loans (house, education, business)",
            "EMI — Equated Monthly Instalment",
            "Loan has principal + interest to repay",
            "Being careful before taking a loan",
            "Never borrow more than you can repay"
          ]
        },
        {
          "n": "Unit 4",
          "t": "RBI and Its Role",
          "topics": [
            "RBI — Reserve Bank of India",
            "RBI prints currency and regulates banks",
            "Monetary policy — controlling inflation and growth",
            "Why RBI increases or decreases interest rates",
            "RBI protects our deposits up to ₹5 lakh (DICGC)"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Cheques and Bank Transfers",
          "topics": [
            "Cheque — written order to bank to pay someone",
            "Parts of a cheque: date, amount, payee, signature",
            "NEFT — National Electronic Funds Transfer",
            "RTGS — Real Time Gross Settlement (large amounts)",
            "IMPS — instant 24×7 transfer for any amount"
          ]
        }
      ]
    },
    {
      "cls": 7,
      "age": "12–13 yrs",
      "level": "Intermediate",
      "theme": "Taxes & Government Money",
      "focus": "Class 7 students can understand civic responsibility. They can grasp why taxes exist, how GST works on a bill, and how public services are funded — connecting personal finance to national economics.",
      "why": "12–13 year olds are developing civic consciousness. They buy things in shops and see GST on bills. They can connect taxes to roads, hospitals and schools.",
      "avoid": "Avoid: income tax slabs, ITR filing, advance tax — still too procedurally complex.",
      "units": [
        {
          "n": "Unit 1",
          "t": "What is a Tax?",
          "topics": [
            "Tax = money citizens pay to the government",
            "Direct tax: paid directly (income tax)",
            "Indirect tax: paid through purchases (GST)",
            "Why taxes are essential for a country",
            "Tax evasion is illegal and harms everyone"
          ]
        },
        {
          "n": "Unit 2",
          "t": "GST in Daily Life",
          "topics": [
            "GST — Goods and Services Tax",
            "GST replaced many old taxes in 2017",
            "0% GST: food grains, vegetables",
            "5% GST: packaged food, restaurants",
            "12-18% GST: electronics, clothes",
            "How to read a GST bill from a shop or restaurant"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Government Budget",
          "topics": [
            "Union Budget presented every year in Parliament",
            "Revenue budget: taxes collected",
            "Expenditure budget: where money is spent",
            "Revenue deficit vs surplus",
            "Why budget matters for every citizen"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Public Services and Tax Money",
          "topics": [
            "Schools, hospitals, roads built with tax money",
            "Police, army, courts — all funded by taxes",
            "Why rich pay more tax (progressive taxation concept)",
            "Public distribution system (PDS) — subsidised food",
            "Our responsibility as future taxpayers"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Black Money and Corruption",
          "topics": [
            "Black money = income not reported to government",
            "How black money harms the country's economy",
            "Demonetisation 2016 — why it happened",
            "Whistleblowing — reporting financial crimes",
            "Being honest in financial dealings"
          ]
        }
      ]
    },
    {
      "cls": 8,
      "age": "13–14 yrs",
      "level": "Intermediate",
      "theme": "Investment & Financial Planning",
      "focus": "Class 8 students are entering secondary school and beginning to think about their own futures. Investment concepts, risk-return trade-off, and long-term planning are now developmentally accessible.",
      "why": "13–14 year olds are capable of abstract reasoning. Concepts like risk, return, and future value are meaningful as they plan for higher education.",
      "avoid": "Avoid: options trading, futures, complex portfolio theory — beyond secondary level understanding.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Why Invest?",
          "topics": [
            "Savings vs investment: savings is safe, investment grows",
            "Inflation eats savings — ₹100 buys less next year",
            "Goal of investment: beat inflation and grow wealth",
            "Risk vs reward: higher risk = potential higher return",
            "Starting early makes a massive difference (time value)"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Investment Options",
          "topics": [
            "Fixed Deposit: safe, fixed return, low risk",
            "PPF: Public Provident Fund — long-term, tax-free",
            "Mutual Funds: pool of many investors, managed by experts",
            "Gold: traditional Indian investment, price fluctuates",
            "Real estate: property, high entry barrier but stable"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Stock Market Basics",
          "topics": [
            "Stock = ownership share in a company",
            "BSE (Bombay Stock Exchange) and NSE",
            "Sensex and Nifty — market indicators",
            "Why share prices go up and down",
            "Stock market is not gambling — it is informed investing"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Insurance",
          "topics": [
            "Insurance = protection against financial loss",
            "Life insurance: family protected if earner dies",
            "Health insurance: medical bills covered",
            "Vehicle insurance: mandatory by law in India",
            "Term insurance vs endowment vs ULIP (basics only)"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Financial Goals",
          "topics": [
            "Short-term goals: 0–2 years (phone, trip)",
            "Medium-term goals: 2–5 years (college fees)",
            "Long-term goals: 5+ years (house, retirement)",
            "Goal-based investing: match investment to goal timeline",
            "Why starting financial planning at 14 makes you wealthy at 40"
          ]
        }
      ]
    },
    {
      "cls": 9,
      "age": "14–15 yrs",
      "level": "Advanced",
      "theme": "Personal Finance & Economy",
      "focus": "Class 9 students are approaching adulthood. They can handle real-world financial scenarios, credit scores, entrepreneurship concepts, and economic linkages. Case-study MCQs are introduced.",
      "why": "14–15 year olds are making real financial decisions and thinking about careers. Credit, business, and economic literacy are immediately relevant.",
      "avoid": "Avoid: complex derivative instruments, foreign exchange trading — still not immediately applicable.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Credit Score and Loans",
          "topics": [
            "CIBIL score — India's credit rating system (300–900)",
            "What a good score looks like (700+) and why it matters",
            "How to maintain a good score: pay on time, don't over-borrow",
            "Impact on getting loans, home, and even jobs",
            "Checking your credit report — right and process"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Inflation and Purchasing Power",
          "topics": [
            "Inflation = general rise in prices over time",
            "CPI — Consumer Price Index measures inflation",
            "Real value vs nominal value of money",
            "How inflation affects savings and investments",
            "RBI's role in controlling inflation in India"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Entrepreneurship",
          "topics": [
            "What an entrepreneur does — creates value and jobs",
            "Business idea → plan → execution → revenue",
            "Profit, loss, and break-even point",
            "Risk-taking as an essential entrepreneurial quality",
            "Young Indian entrepreneurs: inspiration from real stories"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Government Schemes (Financial)",
          "topics": [
            "PM Mudra Yojana — loans for small businesses",
            "Sukanya Samridhi Yojana — for girl child savings",
            "National Pension System (NPS) — retirement savings",
            "Atal Pension Yojana — unorganised sector workers",
            "Why knowing government schemes is financial power"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Ethical Finance",
          "topics": [
            "Ponzi schemes — how they trap victims",
            "Chit fund frauds — warning signs",
            "Multi-level marketing (MLM) — legal vs illegal",
            "Financial cybercrime — UPI fraud, fake investment apps",
            "Always verify before investing: SEBI registered?"
          ]
        }
      ]
    },
    {
      "cls": 10,
      "age": "15–16 yrs",
      "level": "Advanced",
      "theme": "Financial Citizenship",
      "focus": "Class 10 students are on the verge of adult financial life. The syllabus connects personal finance to India's macroeconomy, digital future, and the student's role as a financial citizen of Viksit Bharat.",
      "why": "15–16 year olds will soon have income, bank accounts, and financial responsibilities. This level prepares them for real-world adult financial participation.",
      "avoid": "Avoid: nothing is too advanced now — this is near-adult level. Every topic is immediately applicable.",
      "units": [
        {
          "n": "Unit 1",
          "t": "India's Economic Journey",
          "topics": [
            "GDP — what it means and why it matters",
            "India's growth from 1947 to 2024 — key milestones",
            "From $1 trillion to $3.5 trillion economy",
            "5th largest economy — India's global position",
            "Viksit Bharat 2047 — vision and targets"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Digital India and Fintech",
          "topics": [
            "UPI revolution — India leads the world in real-time payments",
            "NPCI — National Payments Corporation of India",
            "India Stack: Aadhaar + UPI + DigiLocker",
            "Fintech companies disrupting traditional banking",
            "Open banking and account aggregators"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Global Economy Basics",
          "topics": [
            "Forex — foreign exchange markets",
            "Rupee vs Dollar — why exchange rates matter",
            "Imports and exports — trade deficit and surplus",
            "FDI — Foreign Direct Investment in India",
            "How global events (war, oil prices) affect Indian economy"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Sustainable Finance",
          "topics": [
            "ESG — Environment, Social, Governance investing",
            "Green bonds — financing clean energy projects",
            "Why ethical investing is growing globally",
            "India's green economy targets",
            "Can profit and sustainability coexist?"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Financial Rights and Responsibilities",
          "topics": [
            "Consumer protection in financial services — RBI ombudsman",
            "Banking ombudsman — how to file a complaint",
            "Right to Information (RTI) in financial disputes",
            "Financial literacy as a fundamental life skill",
            "My pledge as a financially responsible citizen of India"
          ]
        }
      ]
    }
  ],
  "CIA": [
    {
      "cls": 1,
      "age": "6–7 yrs",
      "level": "Foundational",
      "theme": "My Safe Digital World",
      "focus": "At age 6–7, children can identify a screen and know what a computer or tablet is. The syllabus focuses on safety through simple rules — no technical concepts, only behavioral guidance using stories and examples.",
      "why": "Young children have devices at home but no safety awareness. Simple rules ('tell a trusted adult') are the right level of intervention.",
      "avoid": "Avoid: networking concepts, hacking, encryption, cybercrime law — far too technical for 6-year-olds.",
      "units": [
        {
          "n": "Unit 1",
          "t": "What is a Computer?",
          "topics": [
            "Screen, keyboard, mouse — names and what they do",
            "Laptop, tablet, mobile phone — all are computers",
            "Computer follows what we tell it to do",
            "We use computers to learn, play and communicate",
            "Sitting safely: posture, distance from screen"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Good Screen Time",
          "topics": [
            "Screen time = time spent on a device",
            "Children should not use screens for more than 1 hour for fun",
            "20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds",
            "No screens 1 hour before bedtime — affects sleep",
            "Outdoor play is always better than screen time"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Safe and Unsafe Content",
          "topics": [
            "Safe content: educational cartoons, rhymes, learning games",
            "Unsafe content: violent videos, scary images, adult content",
            "If something on screen feels wrong — close and tell an adult",
            "We never keep unsafe content a secret",
            "Trusted adults: parent, teacher, grandparent"
          ]
        },
        {
          "n": "Unit 4",
          "t": "My Personal Information",
          "topics": [
            "Name, home address, school name — these are private",
            "Never tell these to someone online you don't know",
            "Photo is also personal — not for sharing with strangers",
            "Parents' phone number is private information",
            "Only share with people you know and trust in real life"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Online Strangers",
          "topics": [
            "A stranger is someone you don't know in real life",
            "Online strangers may not be who they say they are",
            "Never agree to meet someone you only know online",
            "If a stranger messages you — tell a trusted adult immediately",
            "You are never in trouble for telling an adult about strangers"
          ]
        }
      ]
    },
    {
      "cls": 2,
      "age": "7–8 yrs",
      "level": "Foundational",
      "theme": "Internet and Me",
      "focus": "Class 2 children can understand that the internet is a large network and that apps and websites are created by people. Building the habit of asking permission before using any digital resource.",
      "why": "7–8 year olds are beginning to use apps independently. Building permission-seeking and kindness habits now creates lifelong digital etiquette.",
      "avoid": "Avoid: IP addresses, servers, data packets, encryption — abstract networking is not appropriate here.",
      "units": [
        {
          "n": "Unit 1",
          "t": "What is the Internet?",
          "topics": [
            "Internet = a giant network connecting computers worldwide",
            "We connect through WiFi or mobile data",
            "Internet helps us learn, communicate and play",
            "Not everything on the internet is true or safe",
            "Always use internet with a parent or trusted adult nearby"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Websites and Apps",
          "topics": [
            "Website = a page on the internet (e.g. YouTube)",
            "App = software on phone (e.g. Google Maps)",
            "Apps have age ratings — some are for older users",
            "Ask parents before downloading any new app",
            "Safe apps for children: educational, well-known, parent-approved"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Password Basics",
          "topics": [
            "Password = a secret key to open your account",
            "A good password is hard to guess",
            "Never use your name or birthday as password",
            "Never share your password — even with best friends",
            "If you forget a password — ask a parent or trusted adult"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Digital Kindness",
          "topics": [
            "Be as kind online as you would be in person",
            "Never send hurtful messages or mean comments",
            "Cyberbullying = bullying that happens online — it hurts just as much",
            "If someone is mean online — tell a trusted adult",
            "Think before you send: would I say this to their face?"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Asking for Help",
          "topics": [
            "Some things online require adult help",
            "Trusted adults: parents, teachers, school counsellor",
            "Never face online problems alone or in secret",
            "Asking for help is brave, not weak",
            "Safety first — always tell before hiding a problem"
          ]
        }
      ]
    },
    {
      "cls": 3,
      "age": "8–9 yrs",
      "level": "Elementary",
      "theme": "Being Smart Online",
      "focus": "Class 3 students are developing critical thinking. They can now evaluate online content — is it true? Is it safe? What should I do with it? Digital footprint awareness is introduced in a simple way.",
      "why": "8–9 year olds are more independent online. Building verification habits and digital footprint awareness prevents long-term reputational damage.",
      "avoid": "Avoid: deep web, dark web, hacking concepts — not appropriate at this level.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Searching Safely",
          "topics": [
            "Search engine = tool to find information (Google, Bing)",
            "Type clear, specific words to find what you need",
            "Not all search results are correct or safe",
            "Pop-ups and ads may be harmful — do not click randomly",
            "Safe search settings — ask parents to enable filters"
          ]
        },
        {
          "n": "Unit 2",
          "t": "True and False Online",
          "topics": [
            "Anyone can write anything on the internet",
            "Not everything you read online is true",
            "Check two different sources before believing something",
            "Fake news: false stories designed to mislead people",
            "WhatsApp forwards are often fake — verify before sharing"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Email Basics",
          "topics": [
            "Email = electronic letter sent through internet",
            "Parts: To, From, Subject, Body, Attachment",
            "Never open email from unknown senders",
            "Attachments from strangers may contain viruses",
            "Spam = unwanted email — do not click links in spam"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Digital Footprint",
          "topics": [
            "Everything you do online leaves a trace",
            "Searches, likes, comments — all recorded",
            "Old posts can be found even years later",
            "Be careful before posting anything online",
            "Your digital footprint follows you into the future"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Screen Health and Safety",
          "topics": [
            "Blue light from screens can harm eyes over time",
            "Sit at arm's length from the screen",
            "Take a break every 20–30 minutes",
            "No screens in dark rooms — keep lights on",
            "Good posture prevents back and neck pain"
          ]
        }
      ]
    },
    {
      "cls": 4,
      "age": "9–10 yrs",
      "level": "Elementary",
      "theme": "Cyber Safety at Home & School",
      "focus": "Class 4 introduces device protection concepts. Students learn about viruses, strong passwords, and cyberbullying — real threats they may already encounter. Practical self-protection skills are the goal.",
      "why": "9–10 year olds may be gaming online, using school portals, and downloading apps independently. Basic device security is now immediately relevant.",
      "avoid": "Avoid: firewall architecture, encryption algorithms, dark web — too technical for this age.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Viruses and Malware",
          "topics": [
            "Computer virus = harmful program that damages devices",
            "How viruses spread: downloads, attachments, USB drives",
            "Signs your device has a virus: slow, crashing, pop-ups",
            "Antivirus software protects devices — must be updated",
            "Never download from unknown websites"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Strong Passwords",
          "topics": [
            "Strong password: 8+ characters, mix of letters, numbers, symbols",
            "Weak passwords: name, 123456, birthdate — easy to guess",
            "Never reuse the same password for multiple accounts",
            "Change password if you think someone knows it",
            "Two accounts, two different passwords always"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Online Gaming Safety",
          "topics": [
            "Online games connect you with real strangers",
            "Never share real name, school, address in a game",
            "Beware of players who ask personal questions",
            "In-app purchases: always ask parents before buying",
            "Gaming addiction: signs and how to balance screen and life"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Cyberbullying",
          "topics": [
            "Cyberbullying = repeated online harassment, threats, humiliation",
            "It happens 24/7 — harder to escape than playground bullying",
            "Types: mean messages, exclusion, spreading rumours, fake profiles",
            "What to do: screenshot, block, tell a trusted adult",
            "You are never to blame for being cyberbullied"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Safe Downloading",
          "topics": [
            "Only download from official app stores (Play Store, App Store)",
            "Pirated content is illegal and full of viruses",
            "Check app permissions before installing",
            "Free apps that ask for too many permissions — be suspicious",
            "If you downloaded something harmful — tell an adult immediately"
          ]
        }
      ]
    },
    {
      "cls": 5,
      "age": "10–11 yrs",
      "level": "Elementary",
      "theme": "Digital Literacy and Responsibility",
      "focus": "Class 5 focuses on responsible digital citizenship — social media awareness, fake news verification, privacy settings, and copyright. Students begin developing ethical online behaviour.",
      "why": "10–11 year olds are aware of social media (even if too young to use it). Building responsible habits before full access is the ideal window.",
      "avoid": "Avoid: complex cyber law sections, social engineering techniques — too advanced at this level.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Social Media Basics",
          "topics": [
            "Social media platforms: Instagram, Facebook, YouTube",
            "Minimum age for most platforms: 13 years",
            "Public vs private accounts — privacy settings matter",
            "Strangers can see your posts if account is public",
            "Never accept friend requests from people you don't know in real life"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Fake News Detection",
          "topics": [
            "Fake news = false information spread to mislead people",
            "Check: Who wrote it? Is the source credible?",
            "Fact-checking tools: Boom, Alt News, Snopes",
            "Look for multiple reputable sources before believing",
            "Before sharing: STOP — THINK — VERIFY — then share or delete"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Copyright and Plagiarism",
          "topics": [
            "Copyright = legal ownership of creative work",
            "Copying someone's work without credit = plagiarism",
            "How to cite sources: mention the name and source",
            "Creative Commons: free-to-use content with conditions",
            "Respecting others' digital work is digital integrity"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Online Privacy",
          "topics": [
            "Cookies = websites tracking your browsing behaviour",
            "Apps collect data: location, contacts, camera, microphone",
            "Why free apps are never truly free — you pay with data",
            "Denying unnecessary permissions protects your privacy",
            "Reading privacy policies (in simple terms)"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Responsible Posting",
          "topics": [
            "Once posted, content can never be fully deleted",
            "Your digital reputation affects real-life opportunities",
            "Never post others' photos without their clear permission",
            "Avoid posting in anger — wait, think, then decide",
            "Positive online identity: build it from today"
          ]
        }
      ]
    },
    {
      "cls": 6,
      "age": "11–12 yrs",
      "level": "Intermediate",
      "theme": "Networks and Cyber Threats",
      "focus": "Class 6 introduces technical internet infrastructure and the major categories of cyber threats. Students learn what phishing looks like, how HTTPS protects them, and India's basic cyber law.",
      "why": "11–12 year olds are using online banking through parents, making online purchases, and using school portals. Threat recognition is now critical.",
      "avoid": "Avoid: nation-state attacks, deep cryptography, network administration — too advanced.",
      "units": [
        {
          "n": "Unit 1",
          "t": "How the Internet Works",
          "topics": [
            "IP address = your device's unique digital address",
            "DNS = converts website names to IP addresses",
            "Browser = software that shows websites (Chrome, Firefox)",
            "HTTP vs HTTPS — S means secure, encrypted connection",
            "Always check for HTTPS padlock before entering personal info"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Types of Cyber Threats",
          "topics": [
            "Phishing = fake email/website designed to steal data",
            "Hacking = unauthorised access to systems or accounts",
            "Ransomware = malware that locks files and demands money",
            "Malware = harmful software (virus, spyware, adware)",
            "Real examples of cyber attacks in India (AIIMS 2022)"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Two-Factor Authentication",
          "topics": [
            "2FA = two layers of security to login",
            "Layer 1: password. Layer 2: OTP or fingerprint",
            "Even if password is stolen, 2FA protects you",
            "Enable 2FA on Gmail, Instagram, WhatsApp",
            "Authenticator apps: Google Authenticator, Authy"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Safe Transactions Online",
          "topics": [
            "Only pay on HTTPS websites with padlock",
            "Check website URL carefully — fake sites look real",
            "Trusted payment gateways: Razorpay, PayU, official bank apps",
            "Never save card details on unknown websites",
            "Check your bank statement regularly for unknown charges"
          ]
        },
        {
          "n": "Unit 5",
          "t": "India's Cyber Laws",
          "topics": [
            "IT Act 2000 — India's primary cyber law",
            "Cybercrime = illegal activity using computers or internet",
            "Examples: hacking, data theft, online fraud, cyberbullying",
            "Report cybercrime at: cybercrime.gov.in",
            "1930 — National Cyber Helpline number in India"
          ]
        }
      ]
    },
    {
      "cls": 7,
      "age": "12–13 yrs",
      "level": "Intermediate",
      "theme": "Social Engineering & Privacy",
      "focus": "Class 7 introduces the human element of cybersecurity — social engineering, OTP frauds, Aadhaar protection, and data privacy laws. Students learn that humans, not just machines, are the target.",
      "why": "12–13 year olds may witness family members being targeted by OTP fraud or KYC scams. Recognising manipulation tactics protects the whole family.",
      "avoid": "Avoid: hacking tools, penetration testing details — not appropriate and potentially harmful.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Social Engineering",
          "topics": [
            "Social engineering = tricking humans, not machines",
            "Pretexting: creating a fake scenario to get information",
            "Baiting: free USB or prize that contains malware",
            "Vishing: fraudulent phone calls pretending to be bank/govt",
            "How to identify and respond: hang up, verify independently"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Data Privacy Laws",
          "topics": [
            "Privacy = your right to control your personal information",
            "India's Digital Personal Data Protection Act 2023",
            "GDPR — Europe's data law that affects global platforms",
            "Your rights: access, correction, deletion of your data",
            "What companies can and cannot do with your data legally"
          ]
        },
        {
          "n": "Unit 3",
          "t": "OTP Frauds and Scams",
          "topics": [
            "Banks NEVER ask for OTP over phone — this is rule #1",
            "UPI scam: collect request sent instead of payment request",
            "Lottery scam: you won, send processing fee — always fake",
            "Fake KYC calls: hang up and call bank directly",
            "Screen sharing scams: AnyDesk/TeamViewer frauds"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Dark Web Awareness",
          "topics": [
            "Surface web: websites we see daily (Google, YouTube)",
            "Deep web: private pages (email inbox, banking portal)",
            "Dark web: hidden websites requiring special software",
            "Why dark web is dangerous and mostly criminal",
            "You do not need to go there — awareness is protection"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Digital Identity Protection",
          "topics": [
            "Aadhaar: do not share full number unnecessarily",
            "Masked Aadhaar: shows only last 4 digits — use this instead",
            "Identity theft: criminal uses your details to commit fraud",
            "How to protect: strong passwords, 2FA, minimal sharing",
            "What to do if identity is stolen: police + UIDAI + bank"
          ]
        }
      ]
    },
    {
      "cls": 8,
      "age": "13–14 yrs",
      "level": "Intermediate",
      "theme": "Cybersecurity Tools and Ethics",
      "focus": "Class 8 explores the tools of protection (firewalls, antivirus, encryption), introduces ethical hacking as a career concept, and addresses digital wellness — mental health impacts of social media.",
      "why": "13–14 year olds are heavy social media users facing FOMO, comparison, and addiction. Simultaneously, they're mature enough to understand security tools and career paths in cybersecurity.",
      "avoid": "Avoid: writing actual hacking code, dark web access methods — security awareness only.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Firewalls and Antivirus",
          "topics": [
            "Firewall = digital wall between your device and the internet",
            "Blocks suspicious incoming and outgoing data",
            "Antivirus = software that scans for and removes threats",
            "Why software updates are critical: patch security holes",
            "Outdated software = open door for hackers"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Encryption Basics",
          "topics": [
            "Encryption = converting data into unreadable code",
            "Only authorised receiver can decrypt and read it",
            "HTTPS uses encryption — data in transit is protected",
            "End-to-end encryption in WhatsApp: only you and receiver read",
            "Why encryption matters for banking, health and private communication"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Ethical Hacking Introduction",
          "topics": [
            "Ethical hacker = security professional who finds weaknesses legally",
            "White hat (ethical) vs Black hat (criminal) vs Grey hat hackers",
            "Bug bounty programs: companies pay hackers to find flaws",
            "Certifications: CEH (Certified Ethical Hacker)",
            "Cybersecurity is one of India's fastest-growing career fields"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Digital Wellness",
          "topics": [
            "Social media addiction: signs — checking phone every 5 minutes",
            "FOMO (Fear of Missing Out) — driven by social media algorithms",
            "How social media affects self-esteem through comparison",
            "Dopamine and the notification loop — why apps are addictive",
            "Digital detox: structured breaks from screens for mental health"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Cybercrime Reporting in India",
          "topics": [
            "Where to report: cybercrime.gov.in (national portal)",
            "1930 — National Cyber Crime Helpline — call immediately",
            "State Cyber Cell: available in every major city",
            "What to save before reporting: screenshots, transaction IDs",
            "Time is critical — report cybercrime within 24 hours of discovery"
          ]
        }
      ]
    },
    {
      "cls": 9,
      "age": "14–15 yrs",
      "level": "Advanced",
      "theme": "Advanced Threats and National Security",
      "focus": "Class 9 takes a national-level perspective — state-sponsored attacks, India's cyber defence infrastructure, IoT risks, and cloud security. Case-study MCQs assess application of knowledge to real scenarios.",
      "why": "14–15 year olds can understand geopolitics and systemic threats. This prepares them to be informed citizens and potential cybersecurity professionals.",
      "avoid": "Avoid: technical exploit code, vulnerability databases — awareness only, no operational hacking knowledge.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Nation-State Cyberattacks",
          "topics": [
            "Countries use cyber weapons against each other's infrastructure",
            "Stuxnet: first known cyber weapon — targeted Iran's nuclear facility",
            "Critical infrastructure attacks: power grid, water, hospitals",
            "AIIMS Delhi ransomware 2022 — patient data and services disrupted",
            "Why cybersecurity is a matter of national security, not just IT"
          ]
        },
        {
          "n": "Unit 2",
          "t": "India's Cyber Infrastructure",
          "topics": [
            "CERT-In: Computer Emergency Response Team India",
            "NCIIPC: National Critical Information Infrastructure Protection Centre",
            "National Cyber Security Policy 2013 — India's framework",
            "Cyber Command under Indian Armed Forces",
            "India's cyber budget and capacity building initiatives"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Cloud Security",
          "topics": [
            "Cloud = storing data on remote servers (Google Drive, iCloud)",
            "Advantages: access anywhere, auto-backup, scalable",
            "Risks: data breach if provider is hacked, privacy concerns",
            "Multi-factor authentication essential for cloud accounts",
            "India's data localisation debate — why Indian data on Indian servers matters"
          ]
        },
        {
          "n": "Unit 4",
          "t": "IoT and Smart Device Risks",
          "topics": [
            "IoT = Internet of Things: smart TVs, Alexa, wearables, CCTV",
            "These devices always listen or record — awareness is essential",
            "Insecure IoT devices used in large-scale cyberattacks (botnets)",
            "Default passwords on routers and smart devices — must be changed",
            "Home network security: separate IoT devices from main network"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Career in Cybersecurity",
          "topics": [
            "Roles: Security Analyst, Ethical Hacker, CISO, Digital Forensics Expert",
            "India needs 1 million cybersecurity professionals by 2025 (NASSCOM)",
            "Certifications: CEH, CISSP, CompTIA Security+, OSCP",
            "Degree paths: B.Tech in CS + cybersecurity specialisation",
            "How to start in school: coding basics, CTF competitions, awareness"
          ]
        }
      ]
    },
    {
      "cls": 10,
      "age": "15–16 yrs",
      "level": "Advanced",
      "theme": "Cyber Citizenship and Future",
      "focus": "Class 10 builds the complete responsible digital citizen — understanding deepfakes, blockchain, digital rights, and India's role in global cybersecurity. Case-study MCQs examine complex real-world scenarios.",
      "why": "15–16 year olds are legal near-adults who will soon vote, work, and carry full digital responsibilities. This level prepares them to be cyber ambassadors in their communities.",
      "avoid": "Avoid: nothing is too advanced now. This is near-adult level — every topic is immediately applicable.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Deepfakes and Misinformation",
          "topics": [
            "Deepfake = AI-generated fake video/audio of a real person",
            "Created using deep learning neural networks — hard to detect",
            "Dangers: political manipulation, defamation, financial fraud",
            "Detection: inconsistencies in eyes, lighting, blinking patterns",
            "India's legal framework: IT Act amendments for deepfake content"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Cybersecurity in Critical Sectors",
          "topics": [
            "Banking sector: prime target for cybercriminals worldwide",
            "Healthcare: patient data + life-critical systems at risk",
            "Power grid: attacking electricity infrastructure could shut down cities",
            "Smart cities: connected infrastructure creates new attack surfaces",
            "India's plan: sector-specific security policies and CERT-In advisories"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Blockchain and Digital Trust",
          "topics": [
            "Blockchain = chain of verified, tamper-proof digital records",
            "Each block contains data, timestamp, and cryptographic hash",
            "Why it is nearly impossible to alter blockchain data",
            "Real use cases: cryptocurrency, land records, supply chain, voting",
            "India's blockchain initiatives: DigiLocker, supply chain transparency"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Digital Rights and Responsibilities",
          "topics": [
            "Right to internet access — recognised globally as a basic right",
            "Right to privacy online — fundamental right in India (Puttaswamy judgement)",
            "Freedom of expression online — within legal limits",
            "What is hate speech and online harassment under Indian law (IT Act Sec 67)",
            "Our responsibility: report, be ethical, protect others online"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Building a Safer Digital India",
          "topics": [
            "Every citizen's role in India's cyber safety ecosystem",
            "Reporting cybercrime is a civic duty — not optional",
            "Be a cyber ambassador: teach family members about online safety",
            "Connect digital safety to Viksit Bharat 2047's goals",
            "My pledge: I will be a responsible, aware, and safe digital citizen of India"
          ]
        }
      ]
    }
  ],
  "AIA": [
    {
      "cls": 1,
      "age": "6–7 yrs",
      "level": "Foundational",
      "theme": "Machines That Help Us",
      "focus": "At age 6–7, children understand machines through everyday objects — washing machine, fan, calculator. The syllabus introduces 'smart machines' through familiar characters and stories — no programming, no algorithms.",
      "why": "Young children understand causality: press button → machine does something. Building the concept of 'helpful machine' is the right foundation before introducing intelligence.",
      "avoid": "Avoid: programming code, algorithms, neural networks, data — too abstract. Stick to observable, tangible machines.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Helpful Machines",
          "topics": [
            "Machines help us do work faster and more easily",
            "Fan keeps us cool, washing machine washes clothes",
            "Calculator does maths, microwave heats food",
            "Tractor helps farmers, elevator lifts us up",
            "We use many machines every single day without noticing"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Smart vs Simple Machines",
          "topics": [
            "Simple machine: always does the same thing (fan, switch)",
            "Smart machine: can change what it does (smart AC, phone)",
            "A fan only spins — a smart AC adjusts temperature automatically",
            "Voice assistant understands what we say — ordinary machine cannot",
            "Smart machines feel more helpful because they listen and respond"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Robots in Stories",
          "topics": [
            "Robot = machine that can move and do tasks automatically",
            "Robots in cartoons: WALL-E, Baymax, Doraemon's gadgets",
            "Real robots in factories: make cars and phones",
            "Medical robots: help doctors do precise operations",
            "Space robots: NASA's Curiosity Rover explores planet Mars"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Computers and Thinking",
          "topics": [
            "Computer follows instructions step by step",
            "Instructions are given by a person (programmer)",
            "Computer cannot think on its own — it follows rules exactly",
            "Wrong instruction = wrong answer — garbage in, garbage out",
            "A recipe is like instructions for a computer"
          ]
        },
        {
          "n": "Unit 5",
          "t": "AI Helpers Around Us",
          "topics": [
            "AI = Artificial Intelligence = making machines act smart",
            "Google Assistant, Siri, Alexa understand our voice",
            "Google Maps finds the best route for us automatically",
            "YouTube suggests videos based on what we watch",
            "Face unlock on phones recognises our face — that is AI"
          ]
        }
      ]
    },
    {
      "cls": 2,
      "age": "7–8 yrs",
      "level": "Foundational",
      "theme": "Computers Learn Like We Do",
      "focus": "Class 2 draws powerful parallels between how children learn and how computers are taught. Children understand learning from experience — this makes machine learning intuitive through analogy.",
      "why": "7–8 year olds are in active learning mode — learning from mistakes, repetition, and examples. Drawing this parallel to how AI learns makes the concept immediate and relatable.",
      "avoid": "Avoid: data sets, training loops, gradient descent — far too technical for 7-year-olds.",
      "units": [
        {
          "n": "Unit 1",
          "t": "How Do We Learn?",
          "topics": [
            "We learn by seeing, hearing, doing and practising",
            "Repetition makes us better: the more we practise, the better we become",
            "We make mistakes and learn from them",
            "Teachers give us examples to understand new ideas",
            "Our brain stores learning as memories for future use"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Computers Learn from Examples",
          "topics": [
            "Computers learn by being shown thousands of examples",
            "Show it 1,000 pictures of cats — it learns what a cat looks like",
            "The more examples given, the smarter the computer becomes",
            "This is called Machine Learning — machines learn from data",
            "Just like we learn from experience, computers learn from data"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Instructions and Algorithms",
          "topics": [
            "Algorithm = a set of step-by-step instructions to solve a problem",
            "Recipe for making chai is an algorithm",
            "Steps must be in correct order — sequence matters",
            "If one step is wrong, the result is wrong",
            "Computers follow algorithms perfectly but need correct instructions"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Recognising Patterns",
          "topics": [
            "Humans are excellent at finding patterns",
            "Pattern: 2, 4, 6, 8 — the next is 10",
            "Computers can find patterns in very large amounts of data",
            "A camera learns to recognise faces by finding patterns in features",
            "Pattern recognition is the foundation of how AI thinks"
          ]
        },
        {
          "n": "Unit 5",
          "t": "AI Makes Mistakes Too",
          "topics": [
            "AI is not perfect — it can be wrong",
            "AI trained on wrong examples gives wrong answers",
            "Autocorrect sometimes corrects the wrong word — AI mistake!",
            "AI works best when given lots of good examples",
            "Humans must always check important AI decisions"
          ]
        }
      ]
    },
    {
      "cls": 3,
      "age": "8–9 yrs",
      "level": "Elementary",
      "theme": "AI in Everyday Life",
      "focus": "Class 3 maps AI to applications children encounter daily — voice assistants, auto-correct, game characters, recommendation systems. Moving from 'what is AI' to 'where do I see AI every day'.",
      "why": "8–9 year olds use phones, watch YouTube, and play games. Recognising AI in their daily experience makes it real, not abstract.",
      "avoid": "Avoid: code, neural network layers, data science — too technical. Keep at the application recognition level.",
      "units": [
        {
          "n": "Unit 1",
          "t": "AI on Our Phones",
          "topics": [
            "Auto-correct fixes spelling mistakes as you type — AI",
            "Face unlock recognises your face to open phone — AI",
            "Google Maps routes and re-routes you in real time — AI",
            "Auto-brightness adjusts screen based on light — AI",
            "Voice to text: speaking is converted to typed words — AI"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Recommendation Systems",
          "topics": [
            "YouTube suggests videos you might like — that is AI",
            "Netflix recommends shows based on what you watched — AI",
            "Amazon shows products similar to what you buy — AI",
            "The AI watches your habits and predicts what you want next",
            "This is called a recommendation system or recommendation engine"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Voice Assistants",
          "topics": [
            "Siri, Google Assistant, Alexa — all voice assistants",
            "They convert your voice into text using speech recognition",
            "Then they understand the meaning (Natural Language Processing)",
            "Then they speak back the answer using text-to-speech",
            "They get smarter as more people use and correct them"
          ]
        },
        {
          "n": "Unit 4",
          "t": "AI in Games",
          "topics": [
            "Game characters that react to your moves use AI",
            "They avoid obstacles, choose paths, and make decisions",
            "Chess-playing computers use AI to plan many moves ahead",
            "God Mode opponents in games adapt to your skill level",
            "AI in games makes the experience more realistic and challenging"
          ]
        },
        {
          "n": "Unit 5",
          "t": "AI Helping Doctors",
          "topics": [
            "AI can analyse X-rays and detect diseases faster than humans",
            "AI helps find cancer cells in scan images (IBM Watson Health)",
            "AI predicts which patients are at risk of getting sick",
            "Robotic surgery: AI-guided robots make precise cuts",
            "AI in India: AIIMS uses AI tools to help diagnose rare diseases"
          ]
        }
      ]
    },
    {
      "cls": 4,
      "age": "9–10 yrs",
      "level": "Elementary",
      "theme": "How AI Thinks",
      "focus": "Class 4 opens the 'black box' of AI — data, training, decision trees, and image recognition. Students understand the logical process behind AI decisions using concrete, visual examples.",
      "why": "9–10 year olds can follow logical if-then reasoning. Decision trees and training concepts are accessible when explained through familiar scenarios like animal recognition.",
      "avoid": "Avoid: mathematical functions, matrix multiplication, neural network math — too complex for this level.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Data — AI's Food",
          "topics": [
            "AI needs data to learn — data is its food",
            "Data can be images, text, numbers, sounds or video",
            "More data = smarter AI (usually)",
            "Bad data = wrong answers — data quality matters",
            "Where AI data comes from: internet, cameras, sensors, surveys"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Training an AI",
          "topics": [
            "Training = teaching the AI by showing it many examples",
            "Labelled data: images of dogs marked 'dog' help AI learn",
            "AI makes a guess → if wrong, it adjusts → tries again → improves",
            "This learning process uses mathematical calculations automatically",
            "After training, the AI can recognise new examples it has never seen"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Decision Trees",
          "topics": [
            "Decision tree = a series of yes/no questions that lead to an answer",
            "Is it an animal? Yes → Does it have feathers? Yes → Is it a bird?",
            "Computers use decision trees to classify data into categories",
            "Spam filters: Is sender unknown? Is subject suspicious? → Spam!",
            "Simple, visual and easy to understand — basis of early AI systems"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Image Recognition",
          "topics": [
            "AI can identify objects, faces and text in photos",
            "Trained on millions of labeled images of each category",
            "Google Lens: point camera at anything → AI identifies it",
            "How does it work: AI looks for shapes, edges, colours, textures",
            "Medical AI: identifies disease patterns in X-rays and MRI scans"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Good AI and Bad AI Use",
          "topics": [
            "AI can be used for good: healthcare, education, safety",
            "AI can be misused: fake news, deepfakes, surveillance",
            "Responsible AI: used with human oversight and ethical guidelines",
            "AI weapons are dangerous when used without human control",
            "We must always ask: Is this AI being used fairly and responsibly?"
          ]
        }
      ]
    },
    {
      "cls": 5,
      "age": "10–11 yrs",
      "level": "Elementary",
      "theme": "AI and Creativity",
      "focus": "Class 5 explores the intersection of AI and human creativity — art, music, writing. It also raises the critical question of what makes human creativity unique versus AI-generated output.",
      "why": "10–11 year olds are deeply engaged with creative activities. Exploring AI creativity stimulates philosophical thinking: what makes us different from machines?",
      "avoid": "Avoid: GAN architecture, model weights, training scripts — keep focus on awareness and philosophical thinking.",
      "units": [
        {
          "n": "Unit 1",
          "t": "AI-Generated Art",
          "topics": [
            "DALL-E, Midjourney, Stable Diffusion: AI creates images from text",
            "Type 'a cat playing chess in space' → AI generates the image",
            "AI trained on billions of images from the internet",
            "Can AI be truly creative? Or only remix existing patterns?",
            "Indian artists using AI: new possibilities and controversies"
          ]
        },
        {
          "n": "Unit 2",
          "t": "AI in Music",
          "topics": [
            "AI can compose music in seconds",
            "Trained on thousands of songs — learns patterns in melody and rhythm",
            "AIVA, Soundraw, Mubert — AI music generation tools",
            "Music for films, games and ads — sometimes AI-composed",
            "Can AI create music that makes us feel? The debate continues"
          ]
        },
        {
          "n": "Unit 3",
          "t": "AI Writing Stories and Text",
          "topics": [
            "ChatGPT, Claude, Gemini — AI language models that write text",
            "Can write essays, stories, emails, poems and code",
            "AI generates text by predicting the most likely next word",
            "AI does not 'understand' — it pattern-matches at massive scale",
            "Using AI as a writing assistant, not a replacement for thinking"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Human Creativity vs AI Output",
          "topics": [
            "Humans create from emotion, experience, imagination and intention",
            "AI generates by statistically combining existing patterns",
            "AI has no feelings, experiences or original intentions",
            "True originality — can AI ever achieve it?",
            "Human creativity + AI tools = powerful combination for the future"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Using AI Responsibly and Honestly",
          "topics": [
            "Using AI to help is okay — using AI to cheat is wrong",
            "Always credit AI when it helped you in your work",
            "AI has biases from the data it was trained on — be aware",
            "Don't trust AI blindly — always verify important information",
            "Responsible AI use: a life skill for the 21st century"
          ]
        }
      ]
    },
    {
      "cls": 6,
      "age": "11–12 yrs",
      "level": "Intermediate",
      "theme": "Machine Learning Basics",
      "focus": "Class 6 introduces machine learning formally — supervised vs unsupervised learning, classification, clustering, and neural networks at a conceptual level. Real Indian use cases ground the learning.",
      "why": "11–12 year olds can understand categories, sorting, and systematic thinking. Machine learning concepts map well to their logical reasoning abilities.",
      "avoid": "Avoid: backpropagation math, loss functions, gradient descent — conceptual understanding only.",
      "units": [
        {
          "n": "Unit 1",
          "t": "What is Machine Learning?",
          "topics": [
            "ML = a branch of AI where machines learn from data without being explicitly programmed",
            "Supervised learning: learning with labelled examples (spam filter)",
            "Unsupervised learning: finding hidden patterns (customer grouping)",
            "Reinforcement learning: learning through rewards and penalties (game AI)",
            "Traditional programming: rule-based. ML: learns rules from data"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Classification and Clustering",
          "topics": [
            "Classification: put data into predefined categories (email = spam or not)",
            "Spam filter classifies emails using millions of spam examples",
            "Clustering: group similar data without pre-defined categories",
            "E-commerce clusters similar products together",
            "Medical: cluster patients by similar symptoms for research"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Neural Networks (Intro)",
          "topics": [
            "Inspired by the human brain's structure of neurons",
            "Input layer → Hidden layers → Output layer",
            "Each connection has a weight — adjusted during training",
            "Deeper networks (more hidden layers) = Deep Learning",
            "Used in image recognition, voice recognition, language translation"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Training, Testing and Validation",
          "topics": [
            "Training set: data used to teach the model",
            "Testing set: unseen data used to evaluate performance",
            "Overfitting: model memorises training data but fails on new data",
            "Underfitting: model too simple to capture patterns",
            "The goal: a model that generalises well to new, unseen data"
          ]
        },
        {
          "n": "Unit 5",
          "t": "AI in Indian Agriculture",
          "topics": [
            "Crop disease detection: AI analyses leaf images for disease",
            "Weather prediction: AI models help predict monsoon patterns",
            "Yield prediction: AI estimates harvest quantity for planning",
            "e-Krishi, Kisan AI: Indian govt AI tools for farmers",
            "Drone spraying using AI: precision agriculture in India"
          ]
        }
      ]
    },
    {
      "cls": 7,
      "age": "12–13 yrs",
      "level": "Intermediate",
      "theme": "Natural Language and Vision AI",
      "focus": "Class 7 covers the two most impactful AI frontiers — language (NLP) and vision (computer vision). Students understand how AI processes human text and visual data, with strong Indian examples.",
      "why": "12–13 year olds use language and visual AI daily — Google Translate, face filters, chatbots. Understanding how these work prepares them to evaluate and use these tools critically.",
      "avoid": "Avoid: transformer architecture math, attention mechanisms — keep at conceptual application level.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Natural Language Processing",
          "topics": [
            "NLP = AI ability to understand and generate human language",
            "Sentiment analysis: AI reads text and identifies emotion (positive/negative)",
            "Google Translate uses NLP to translate between 130+ languages",
            "Text summarisation: AI condenses long documents into short summaries",
            "Bhashini: India's government NLP initiative for Indian languages"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Chatbots and Virtual Assistants",
          "topics": [
            "Rule-based chatbot: follows pre-written conversation trees",
            "AI-powered chatbot: understands natural language and generates responses",
            "ChatGPT, Claude, Gemini — large language model chatbots",
            "Customer service chatbots: used by banks, airlines, e-commerce",
            "How chatbots fail: they hallucinate (make up incorrect facts confidently)"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Computer Vision",
          "topics": [
            "Computer Vision = AI ability to understand images and video",
            "Object detection: identifies multiple objects in one image",
            "Facial recognition: identifies individuals from face features",
            "Used in: security cameras, medical imaging, self-driving cars",
            "Controversies: facial recognition and privacy invasion"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Speech Recognition",
          "topics": [
            "Speech recognition = converting spoken words to text",
            "How it works: audio → features → phonemes → words → meaning",
            "Siri, Google Assistant, Cortana all use speech recognition",
            "Whisper (OpenAI) achieves near-human accuracy in multiple languages",
            "Applications: transcription, accessibility, voice search, call centres"
          ]
        },
        {
          "n": "Unit 5",
          "t": "AI for Accessibility",
          "topics": [
            "AI making the world more accessible for differently-abled people",
            "Text-to-speech: reads screen content aloud for visually impaired",
            "Speech-to-text: types spoken words for hearing-impaired",
            "Microsoft SeeingAI: AI that describes the world for blind users",
            "Sign language recognition: AI converting signs to text in real time"
          ]
        }
      ]
    },
    {
      "cls": 8,
      "age": "13–14 yrs",
      "level": "Intermediate",
      "theme": "AI Ethics and Society",
      "focus": "Class 8 examines the societal implications of AI — bias, job displacement, surveillance, and India's AI policy. Critical thinking about technology is as important as understanding the technology itself.",
      "why": "13–14 year olds are forming values and social consciousness. They can engage with ethical dilemmas meaningfully. AI ethics is as important as AI capability.",
      "avoid": "Avoid: political ideology in AI ethics — present multiple perspectives fairly and balanced.",
      "units": [
        {
          "n": "Unit 1",
          "t": "AI Bias and Fairness",
          "topics": [
            "AI bias: systematic unfairness in AI decisions",
            "Source: biased training data reflects historical human discrimination",
            "Amazon's hiring AI discriminated against women — real example",
            "Facial recognition accuracy lower for darker skin tones — research-proven",
            "How to fix: diverse training data, algorithmic audits, human oversight"
          ]
        },
        {
          "n": "Unit 2",
          "t": "AI and Jobs",
          "topics": [
            "AI automates repetitive, rule-based tasks first",
            "Jobs at risk: data entry, basic accounting, call centres, manufacturing",
            "Jobs growing with AI: data scientists, AI engineers, ethicists",
            "New jobs AI creates that did not exist before",
            "India's IT workforce: threat and opportunity simultaneously"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Privacy in the AI Age",
          "topics": [
            "Surveillance capitalism: collecting data to predict and influence behaviour",
            "Facial recognition in public spaces — China, India, USA debate",
            "Data brokers: companies that sell your personal data",
            "Your phone knows your location, habits, contacts, health data",
            "DPDP Act 2023: India's first comprehensive data protection law"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Responsible AI Principles",
          "topics": [
            "Fairness: AI must not discriminate",
            "Transparency: AI decisions must be explainable",
            "Accountability: who is responsible when AI causes harm?",
            "Privacy: collect minimum data needed",
            "Human oversight: critical AI decisions must have human review — always"
          ]
        },
        {
          "n": "Unit 5",
          "t": "India's AI Policy",
          "topics": [
            "NITI Aayog National AI Strategy (NIAIS) — AI for All, AI for India",
            "INDIAai mission — ₹10,000 crore for AI development",
            "AI applications in governance: Aarogya Setu, DigiLocker, UMANG",
            "India's AI in agriculture, healthcare and education focus",
            "India aims to be a top 3 global AI power by 2030"
          ]
        }
      ]
    },
    {
      "cls": 9,
      "age": "14–15 yrs",
      "level": "Advanced",
      "theme": "Advanced AI and Real-World Systems",
      "focus": "Class 9 covers deep learning architectures, generative AI, autonomous systems, and AI in high-stakes sectors. Case-study MCQs require applying AI knowledge to complex real-world scenarios.",
      "why": "14–15 year olds are beginning to consider career paths and are capable of conceptual understanding of sophisticated AI systems. This level prepares potential future AI professionals.",
      "avoid": "Avoid: coding deep learning models — conceptual understanding and application is the goal.",
      "units": [
        {
          "n": "Unit 1",
          "t": "Deep Learning",
          "topics": [
            "Deep Learning = machine learning using neural networks with many layers",
            "CNN (Convolutional Neural Network): specialised for images",
            "RNN (Recurrent Neural Network): specialised for sequences (text, audio)",
            "Why 'deep'?: dozens to hundreds of hidden layers",
            "Requires massive data and computing power — why GPUs matter"
          ]
        },
        {
          "n": "Unit 2",
          "t": "Generative AI",
          "topics": [
            "Generative AI = AI that creates new content (text, image, video, audio)",
            "LLMs (Large Language Models): ChatGPT, Claude, Gemini — trained on internet text",
            "How LLMs work: predict next word at massive scale with billions of parameters",
            "DALL-E, Midjourney: generate images from text descriptions",
            "Generative AI risks: deepfakes, misinformation, copyright issues"
          ]
        },
        {
          "n": "Unit 3",
          "t": "Autonomous Systems",
          "topics": [
            "Autonomous = self-operating without human intervention",
            "Self-driving cars: sensors + computer vision + AI = navigate roads",
            "Levels of autonomy: Level 0 (manual) to Level 5 (fully self-driving)",
            "Drones: AI-guided autonomous flight for delivery, surveillance, agriculture",
            "Ethical issue: who is liable when an autonomous vehicle causes an accident?"
          ]
        },
        {
          "n": "Unit 4",
          "t": "AI in Healthcare India",
          "topics": [
            "AI drug discovery: Tata Institute, IISc use AI to identify drug candidates",
            "Diagnostic AI: used in AIIMS and private hospitals for early cancer detection",
            "AI mental health: Wysa, iCall — AI-assisted mental health support apps",
            "Challenges: data quality in India, rural access, doctor resistance",
            "Opportunity: India's patient data volume — largest in world — massive AI training asset"
          ]
        },
        {
          "n": "Unit 5",
          "t": "AI Research in India",
          "topics": [
            "IIT labs: cutting-edge AI research in NLP, computer vision, robotics",
            "DRDO: AI for defence applications — drone swarms, intelligence analysis",
            "ISRO: AI for satellite image analysis, mission planning",
            "India's AI startups: Sarvam, Krutrim — building India-first LLMs",
            "Collaborative AI: India-US, India-UK bilateral AI research initiatives"
          ]
        }
      ]
    },
    {
      "cls": 10,
      "age": "15–16 yrs",
      "level": "Advanced",
      "theme": "AI for a Better India",
      "focus": "Class 10 connects AI to India's largest challenges and the student's role in the AI-powered future. It challenges students to envision how they will use AI to contribute to Viksit Bharat 2047.",
      "why": "15–16 year olds are choosing their futures. This level is designed to inspire and equip them to see AI not as a threat but as the most powerful tool their generation will ever have.",
      "avoid": "Avoid: nothing is too advanced now. These students are nearly adult learners. Every topic is immediately relevant.",
      "units": [
        {
          "n": "Unit 1",
          "t": "AI and Climate Change",
          "topics": [
            "AI predicts extreme weather events earlier than traditional models",
            "Optimising energy grids: AI reduces energy waste in real time",
            "Google DeepMind's AlphaFold: solved 200 million protein structures for drug discovery",
            "Smart agriculture: AI-driven water and fertiliser optimisation",
            "India's climate commitment: AI helping monitor emissions and green targets"
          ]
        },
        {
          "n": "Unit 2",
          "t": "AI in Education",
          "topics": [
            "Personalised learning: AI adapts content to each student's pace and style",
            "Adaptive testing: questions get harder or easier based on performance",
            "Language learning apps (Duolingo) use AI to teach at optimal pace",
            "Bridging rural-urban gap: AI can bring quality teaching to remote India",
            "Challenges: digital divide, teacher resistance, data privacy for minors"
          ]
        },
        {
          "n": "Unit 3",
          "t": "AI in Governance",
          "topics": [
            "DigiLocker: AI-verified digital document storage for 150+ crore citizens",
            "UMANG: single app for 1,200+ government services using AI",
            "PM-KISAN: AI-assisted farmer payment verification",
            "Aarogya Setu: AI contact tracing during pandemic",
            "Smart city management: AI for traffic, waste, energy and water"
          ]
        },
        {
          "n": "Unit 4",
          "t": "Future of AI — AGI and Beyond",
          "topics": [
            "Narrow AI (today): excels at one specific task",
            "AGI (Artificial General Intelligence): human-level reasoning across all tasks — not yet achieved",
            "ASI (Artificial Super Intelligence): beyond human intelligence — theoretical only",
            "Key debate: when will AGI arrive? OpenAI, DeepMind, Anthropic working actively",
            "Ethics of AGI: safety, alignment with human values, and global governance"
          ]
        },
        {
          "n": "Unit 5",
          "t": "Becoming an AI-Ready Citizen",
          "topics": [
            "Skills to develop: logical thinking, data literacy, prompt engineering, coding basics",
            "Careers in AI: researcher, engineer, ethicist, product manager, policy analyst",
            "Starting now: free resources — Khan Academy, NPTEL, Google AI, Coursera",
            "AI is a tool — values, creativity and empathy remain uniquely human",
            "My pledge: I will use AI responsibly, ethically and in service of a better India"
          ]
        }
      ]
    }
  ]
};
