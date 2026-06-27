/* ============================================================
   Aivanta Scholar Foundation — class-wise syllabus explorer
   30 combinations (Classes 1-10 x FAA, CIA, AIA).
   Renders into #syllabus-units based on active class + subject.
   ============================================================ */

(function () {
  "use strict";

  // Each entry: [Unit title, "topic; topic; topic"]
  const SYL = {
    FAA: {
      1: [["What is Money", "Coins and notes; recognising money; why we use money"],
          ["Needs vs Wants", "Things we need; things we like; making simple choices"],
          ["Earning", "How people earn; jobs around us; effort and reward"],
          ["Spending Wisely", "Buying what we need; not wasting"],
          ["Saving", "Piggy bank; saving for later; small habits"]],
      2: [["Buying & Selling", "Shops and markets; price of things; giving change"],
          ["Smart Choices", "Comparing two things; value for money"],
          ["Saving Goals", "Saving for a toy; patience; counting savings"],
          ["Sharing & Giving", "Helping others; donating; kindness with money"],
          ["Keeping Money Safe", "Where money is kept; not losing it"]],
      3: [["Banks", "What a bank does; deposit and withdraw; bank passbook"],
          ["Budgeting Basics", "Income and spending; simple plan"],
          ["Wants vs Needs+", "Prioritising; delayed gratification"],
          ["Honest Money", "Earning fairly; honesty in money matters"],
          ["Saving Habits", "Regular saving; tracking savings"]],
      4: [["Digital Money", "Cards and UPI basics; cashless payments"],
          ["Family Budget", "Household expenses; planning together"],
          ["Goals & Plans", "Short and long term goals; saving plans"],
          ["Smart Shopping", "Comparing prices; discounts and offers"],
          ["Money Safety", "Keeping PINs secret; safe handling"]],
      5: [["Banking Services", "Savings account; interest basics; ATM"],
          ["Budgeting", "Making a monthly budget; balancing income"],
          ["Saving & Investing", "Why we save; intro to growing money"],
          ["Consumer Awareness", "Bills, MRP, receipts; being a smart buyer"],
          ["Avoiding Scams", "Too-good offers; asking elders"]],
      6: [["The Banking System", "Types of accounts; cheques; loans basics"],
          ["Earning & Income", "Salary, business, savings income"],
          ["Budget & Track", "Income-expense tracking; surplus and deficit"],
          ["Intro to Investing", "Savings vs investment; risk and return"],
          ["Financial Safety", "Fraud awareness; secure transactions"]],
      7: [["Money & The Economy", "How money flows; demand and supply basics"],
          ["Saving & Interest", "Simple vs compound interest; growth of savings"],
          ["Investment Options", "Bank deposits, gold, mutual funds intro"],
          ["Taxes Intro", "Why we pay taxes; GST basics"],
          ["Fraud Prevention", "Phishing, fake schemes, OTP safety"]],
      8: [["Banking & Credit", "Loans, EMIs, credit basics; responsible borrowing"],
          ["Investing Deeper", "Risk-return; diversification idea"],
          ["Taxation", "Direct and indirect taxes; income tax basics"],
          ["Insurance", "Why insurance; types; protecting family"],
          ["Smart Consumer", "Rights, complaints, financial decisions"]],
      9: [["Personal Finance", "Goal-based planning; budgeting; net worth"],
          ["Markets & Investing", "Stocks, bonds, mutual funds; SIP"],
          ["Banking & Credit Score", "Credit history; CIBIL; loan management"],
          ["Taxation & Compliance", "Income tax slabs; filing basics; PAN"],
          ["Case Studies", "Real-life financial decision scenarios (MCQ)"]],
      10: [["Financial Citizenship", "Ethics; responsible money behaviour"],
           ["Indian Economy", "GDP, inflation, RBI; economic vision"],
           ["Investing & Wealth", "Portfolio basics; long-term wealth"],
           ["Fintech & Future", "UPI, digital banking, neo-banks, blockchain intro"],
           ["Case Studies", "Policy and decision-based MCQs"]]
    },
    CIA: {
      1: [["Computer Parts", "Screen, keyboard, mouse; what they do"],
          ["Good Screen Time", "How long; healthy habits; eye care"],
          ["Safe vs Unsafe", "Good content; telling an adult"],
          ["Personal Information", "Name and address are private"],
          ["Online Strangers", "Don't talk to strangers online; tell an adult"]],
      2: [["Devices Around Us", "Phones, tablets, computers; using them safely"],
          ["Kind Online", "Being polite; no mean messages"],
          ["Secret Information", "Passwords are secret; not sharing"],
          ["Asking for Help", "Telling a trusted adult when worried"],
          ["Safe Games & Apps", "Age-appropriate apps; permission first"]],
      3: [["Passwords", "Strong passwords; keeping them secret"],
          ["Safe Searching", "Searching safely; kid-safe sites"],
          ["Cyberbullying Intro", "What it is; what to do"],
          ["Privacy Basics", "What to share, what not to"],
          ["Trusted Adults", "Reporting problems online"]],
      4: [["Internet Basics", "How the internet works simply; websites"],
          ["Safe Communication", "Email and chat manners and safety"],
          ["Recognising Tricks", "Fake prizes; pop-ups; clickbait"],
          ["Protecting Privacy", "Profile privacy; photos online"],
          ["Digital Footprint", "What you post stays online"]],
      5: [["Online Safety", "Safe browsing; secure sites (https)"],
          ["Cyberbullying", "Identifying, preventing, reporting"],
          ["Privacy & Data", "Personal data; app permissions"],
          ["Scams & Frauds", "Phishing basics; fake messages"],
          ["Digital Ethics", "Respect, honesty and rules online"]],
      6: [["How Threats Work", "Viruses, malware basics; safe downloads"],
          ["Account Security", "Two-factor auth; strong passwords"],
          ["Social Media Safety", "Privacy settings; safe sharing"],
          ["Fraud Awareness", "OTP scams; fake offers; UPI safety"],
          ["Digital Citizenship", "Rights and responsibilities online"]],
      7: [["Cyber Threats", "Phishing, malware, ransomware basics"],
          ["Protecting Devices", "Antivirus, updates, backups"],
          ["Privacy & Identity", "Identity theft; data protection"],
          ["Online Frauds", "Banking fraud; fake calls; safe payments"],
          ["Digital Rights", "Acceptable use; respecting others"]],
      8: [["Cyber Security Basics", "Encryption idea; secure networks; VPN intro"],
          ["Social Engineering", "How scammers manipulate; staying alert"],
          ["Misinformation", "Fake news; verifying sources"],
          ["Cyber Law Intro", "IT Act basics; reporting cybercrime"],
          ["Responsible Use", "Screen balance; digital wellbeing"]],
      9: [["Advanced Threats", "Deepfakes, botnets, data breaches"],
          ["Privacy & Surveillance", "Data rights; consent; tracking"],
          ["Cyber Law", "IT Act, cybercrime reporting, helpline 1930"],
          ["Digital Ethics", "AI misuse; responsible behaviour"],
          ["Case Studies", "Real cyber-incident MCQ scenarios"]],
      10: [["National Cyber Security", "Critical infrastructure; CERT-In"],
           ["Deepfakes & Democracy", "Threats to society and trust"],
           ["Digital Rights & Laws", "Privacy laws; data protection act"],
           ["Cyber Citizenship", "National responsibility online"],
           ["Case Studies", "Policy and decision-based MCQs"]]
    },
    AIA: {
      1: [["Helpful Machines", "Machines that help us daily"],
          ["Smart vs Simple", "A toy car vs a talking toy"],
          ["Robots in Stories", "Friendly robots; what they do"],
          ["Computers & Thinking", "Computers follow instructions"],
          ["AI Helpers", "Voice assistants that answer us"]],
      2: [["Machines That Learn", "How some machines get smarter"],
          ["Patterns", "Spotting patterns like a computer"],
          ["AI Around Us", "Cameras, games, assistants"],
          ["Giving Instructions", "Step-by-step commands"],
          ["Being Curious", "Asking how things work"]],
      3: [["What is AI", "Simple meaning of AI"],
          ["AI in Daily Life", "Maps, recommendations, voice"],
          ["Instructions & Logic", "Sequences; simple logic"],
          ["Smart Devices", "Smart speakers and gadgets"],
          ["Good & Safe AI", "Using AI tools safely"]],
      4: [["How Computers Decide", "Rules and choices"],
          ["Data Basics", "What data is; examples"],
          ["AI Examples", "Translation, search, games"],
          ["Algorithms Intro", "Step-by-step problem solving"],
          ["AI & Us", "How AI helps people"]],
      5: [["Intro to AI", "What AI can and cannot do"],
          ["Data & Patterns", "Learning from examples"],
          ["Machine Learning Idea", "Training with data simply"],
          ["AI Applications", "Healthcare, transport, education"],
          ["AI Ethics Basics", "Fairness; using AI responsibly"]],
      6: [["AI Foundations", "Types of AI; narrow vs general"],
          ["Data & Training", "Datasets; how models learn"],
          ["Algorithms", "Classification and prediction idea"],
          ["AI in India", "AI in farming, health, services"],
          ["Responsible AI", "Bias and fairness intro"]],
      7: [["Machine Learning", "Supervised vs unsupervised idea"],
          ["Data Science Basics", "Collecting and cleaning data"],
          ["AI Applications", "Vision, speech, recommendation"],
          ["AI & Society", "Jobs, benefits, concerns"],
          ["Ethics of AI", "Privacy, bias, transparency"]],
      8: [["ML Deeper", "Models, features, accuracy idea"],
          ["Neural Networks Intro", "Inspired by the brain; layers"],
          ["Generative AI", "Text and image generation basics"],
          ["AI in Industry", "Automation; smart systems"],
          ["AI Ethics & Safety", "Responsible and safe AI use"]],
      9: [["Neural Networks", "How deep learning works simply"],
          ["Generative AI", "LLMs, chatbots, image tools"],
          ["AI Applications", "Real systems across sectors"],
          ["AI Ethics & Bias", "Fairness, accountability, misuse"],
          ["Case Studies", "AI decision-based MCQ scenarios"]],
      10: [["Advanced AI", "Deep learning, transformers idea"],
           ["Generative AI & Impact", "Creativity, deepfakes, jobs"],
           ["AI Ethics & Governance", "Regulation; responsible AI"],
           ["India's AI Policy", "National AI mission; future skills"],
           ["Case Studies", "Policy and decision-based MCQs"]]
    }
  };

  const META = {
    FAA: { name: "Financial Awareness", color: "#1A73C8" },
    CIA: { name: "Cyber Intelligence", color: "#0C2D6B" },
    AIA: { name: "Artificial Intelligence", color: "#C8960C" }
  };

  let state = { subject: "FAA", cls: 1 };

  function tier(cls) {
    if (cls <= 2) return "Foundational";
    if (cls <= 5) return "Elementary";
    if (cls <= 8) return "Intermediate";
    return "Advanced";
  }

  function render() {
    const { subject, cls } = state;
    const meta = META[subject];
    const units = SYL[subject][cls] || [];
    const wrap = document.getElementById("syllabus-units");
    if (!wrap) return;

    document.getElementById("syl-subject-name").textContent = meta.name;
    document.getElementById("syl-class-label").textContent = "Class " + cls;
    document.getElementById("syl-tier").textContent = tier(cls) + " tier";

    wrap.innerHTML = units
      .map(
        (u, i) => `
        <div class="reveal is-visible bg-white rounded-2xl ring-1 ring-slate-200 p-6 lift">
          <div class="flex items-start gap-4">
            <span class="shrink-0 w-10 h-10 rounded-xl grid place-items-center font-display font-extrabold text-white"
                  style="background:${meta.color}">${i + 1}</span>
            <div>
              <h3 class="font-display font-bold text-navy">${u[0]}</h3>
              <p class="text-sm text-slate-600 mt-1">${u[1].split(";").map((t) => t.trim()).join(" · ")}</p>
            </div>
          </div>
        </div>`
      )
      .join("");

    document.querySelectorAll("[data-subject]").forEach((b) => {
      const on = b.getAttribute("data-subject") === subject;
      b.setAttribute("aria-pressed", String(on));
      b.classList.toggle("text-white", on);
      b.classList.toggle("bg-navy", on);
      b.classList.toggle("bg-white", !on);
      b.classList.toggle("text-navy", !on);
    });
    document.querySelectorAll("[data-class]").forEach((b) => {
      const on = Number(b.getAttribute("data-class")) === cls;
      b.setAttribute("aria-pressed", String(on));
      b.classList.toggle("bg-gold", on);
      b.classList.toggle("text-navy-900", on);
      b.classList.toggle("bg-slate-100", !on);
      b.classList.toggle("text-slate-700", !on);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-subject]").forEach((b) =>
      b.addEventListener("click", () => {
        state.subject = b.getAttribute("data-subject");
        render();
      })
    );
    document.querySelectorAll("[data-class]").forEach((b) =>
      b.addEventListener("click", () => {
        state.cls = Number(b.getAttribute("data-class"));
        render();
      })
    );
    render();
  });
})();
