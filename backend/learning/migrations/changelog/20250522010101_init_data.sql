begin;

insert into category (name) values 
('Technology'),
('Business'),
('Arts & Design'),
('Health & Wellness'),
('Language Learning'),
('Science'),
('Music'),
('Personal Development');

insert into sub_category (name, category_id) values 
-- Technology (category_id = 1)
('Web Development', 1),
('Data Science', 1),
('Mobile Development', 1),
('Cybersecurity', 1),
-- Business (category_id = 2)
('Marketing', 2),
('Finance', 2),
('Entrepreneurship', 2),
('Project Management', 2),
-- Arts & Design (category_id = 3)
('Graphic Design', 3),
('Photography', 3),
('Digital Art', 3),
-- Health & Wellness (category_id = 4)
('Fitness', 4),
('Nutrition', 4),
('Mental Health', 4),
-- Language Learning (category_id = 5)
('English', 5),
('Spanish', 5),
('French', 5),
-- Science (category_id = 6)
('Physics', 6),
('Chemistry', 6),
('Biology', 6),
-- Music (category_id = 7)
('Piano', 7),
('Guitar', 7),
('Music Theory', 7),
-- Personal Development (category_id = 8)
('Leadership', 8),
('Communication', 8),
('Time Management', 8);

insert into profile_summary (user_id, first_name, last_name) values 
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Sarah', 'Johnson'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Michael', 'Chen'),
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Emma', 'Rodriguez'),
('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'David', 'Thompson'),
('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 'Lisa', 'Anderson'),
('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 'James', 'Wilson'),
('6ba7b815-9dad-11d1-80b4-00c04fd430c8', 'Maria', 'Garcia'),
('6ba7b816-9dad-11d1-80b4-00c04fd430c8', 'Robert', 'Brown'),
('6ba7b817-9dad-11d1-80b4-00c04fd430c8', 'Jennifer', 'Davis'),
('6ba7b818-9dad-11d1-80b4-00c04fd430c8', 'Thomas', 'Miller'),
('6ba7b819-9dad-11d1-80b4-00c04fd430c8', 'Amanda', 'Taylor'),
('6ba7b81a-9dad-11d1-80b4-00c04fd430c8', 'Christopher', 'Moore'),
('6ba7b81b-9dad-11d1-80b4-00c04fd430c8', 'Jessica', 'Jackson'),
('6ba7b81c-9dad-11d1-80b4-00c04fd430c8', 'Daniel', 'Lee'),
('6ba7b81d-9dad-11d1-80b4-00c04fd430c8', 'Rachel', 'White');

with
    month_1 as (select DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') as base)
insert into product (
    educator_id, 
    sub_category_id, 
    type, 
    status, 
    level,
    title,
    objectives,
    description,
    highlights,
    audience,
    requirements,
    language,
    price, 
    has_enrollment, 
    last_scheduled_at
) values 
-- Sarah Johnson (Web Development) - Products 1-4
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 1, 0, 0, 0, 
'Personal Web Development Consultation', 
'Identify your specific development needs and challenges. Create a personalized roadmap for your project. Receive expert guidance on technology choices and architecture.',
'Get personalized advice from an experienced web developer. Whether you''re starting a new project or facing technical challenges, this one-on-one session will help you make informed decisions and overcome obstacles in your development journey.',
'Personalized project assessment and recommendations. Direct access to experienced developer expertise. Flexible scheduling to fit your timeline.',
'Developers seeking project guidance. Entrepreneurs planning web applications. Students working on capstone projects.',
'Basic understanding of web development concepts. Specific project or challenge to discuss. Prepared questions and project details.',
'eng', 150.00, false, null),

('f47ac10b-58cc-4372-a567-0e02b2c3d479', 1, 1, 0, 0,
'React Fundamentals Workshop', 
'Master React component creation and state management. Build interactive user interfaces with modern React patterns. Deploy a complete React application.',
'Join this hands-on workshop to learn React from the ground up. You''ll build real components, understand hooks, and create a functional web application. Perfect for developers ready to dive into modern frontend development with React.',
'Live coding sessions with immediate feedback. Build three complete React projects. Interactive Q&A with experienced instructor.',
'Frontend developers new to React. JavaScript developers wanting to learn modern frameworks. Bootcamp graduates seeking practical React experience.',
'Solid JavaScript fundamentals including ES6+ features. Basic HTML and CSS knowledge. Development environment with Node.js installed.',
'eng', 89.99, true, 
(select base from month_1) + INTERVAL '22 days' + time '09:00:00'),

('f47ac10b-58cc-4372-a567-0e02b2c3d479', 1, 2, 0, 1,
'Full-Stack Web Development Bootcamp', 
'Build complete web applications from frontend to backend. Master database design and API development. Deploy applications to production environments.',
'Transform into a full-stack developer with this comprehensive 8-week program. Learn React, Node.js, databases, and deployment strategies. Build a portfolio of real-world applications that demonstrate your skills to potential employers.',
'Complete full-stack project portfolio development. Expert mentorship throughout the entire program. Career guidance and interview preparation included.',
'Aspiring full-stack developers seeking career change. Frontend developers wanting backend skills. Computer science students preparing for internships.',
'Strong JavaScript foundation and basic programming concepts. Familiarity with HTML, CSS, and basic React. Commitment to 15-20 hours per week study time.',
'eng', 599.99, true,
(select base from month_1) + INTERVAL '2 days' + time '10:00:00'),

('f47ac10b-58cc-4372-a567-0e02b2c3d479', 1, 3, 0, 0,
'JavaScript Essentials', 
'Understand core JavaScript concepts and syntax thoroughly. Apply modern ES6+ features in practical scenarios. Debug and troubleshoot JavaScript code effectively.',
'Master the foundation of modern web development with this comprehensive JavaScript course. From variables and functions to advanced concepts like closures and promises, you''ll build the skills needed for any web development path.',
'Self-paced learning with lifetime access. Practical exercises and coding challenges included. Certificate of completion for professional development.',
'Programming beginners starting their web development journey. Developers from other languages transitioning to JavaScript. Students preparing for advanced frontend frameworks.',
'Basic computer literacy and problem-solving skills. No prior programming experience necessary. Access to a modern web browser and text editor.',
'eng', 79.99, false, null),

-- Michael Chen (Data Science) - Products 5-8
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 2, 0, 0, 1,
'Data Science Career Coaching', 
'Develop a strategic career plan tailored to data science roles. Navigate job market trends and salary negotiations effectively. Build a compelling portfolio that showcases your analytical skills.',
'Accelerate your data science career with personalized guidance from an industry expert. Get insider insights on breaking into tech companies, transitioning from other fields, and advancing to senior data roles.',
'One-on-one career strategy sessions with industry expert. Personalized portfolio review and improvement recommendations. Direct insights into hiring manager expectations.',
'Professionals transitioning into data science careers. Current data analysts seeking advancement opportunities. Recent graduates entering the competitive job market.',
'Basic understanding of data science concepts and tools. Current resume and portfolio materials for review. Clear career goals and timeline expectations.',
'eng', 200.00, false, null),

('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 2, 1, 0, 1,
'Machine Learning Study Group', 
'Implement and compare popular ML algorithms hands-on. Collaborate on real-world projects with peer feedback. Master model evaluation and hyperparameter tuning techniques.',
'Join fellow data enthusiasts in this collaborative learning environment. Each week we tackle different ML concepts through group problem-solving, code reviews, and project presentations that reinforce theoretical knowledge.',
'Weekly live sessions with collaborative problem-solving. Peer code reviews and project feedback sessions. Access to exclusive datasets and real-world case studies.',
'Data scientists seeking peer learning opportunities. ML engineers wanting to explore new algorithms. Analytics professionals building practical ML skills.',
'Solid Python programming skills and pandas proficiency. Basic statistics and linear algebra knowledge. Experience with Jupyter notebooks and data visualization.',
'eng', 120.00, true,
(select base from month_1) + INTERVAL '22 days' + TIME '08:00:00'),

('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 2, 2, 0, 1,
'Python for Data Science Masterclass', 
'Master advanced Python libraries including pandas and scikit-learn. Build end-to-end data science pipelines from raw data to insights. Deploy machine learning models to production environments.',
'Transform raw data into actionable insights with this comprehensive Python-focused program. Learn industry-standard workflows, advanced analytics techniques, and model deployment strategies used by top tech companies.',
'Complete project portfolio with real business datasets. Industry-standard tools and best practices coverage. Lifetime access to course materials and community.',
'Data analysts ready to advance their Python skills. Software developers entering data science field. Business analysts wanting to build technical capabilities.',
'Basic Python programming experience and statistical concepts. Familiarity with data manipulation and basic visualization. Commitment to hands-on project work.',
'eng', 449.99, true,
(select base from month_1) + INTERVAL '4 days' + time '14:00:00'),

('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 2, 3, 0, 0,
'Statistics Fundamentals', 
'Apply statistical concepts to solve real business problems. Understand hypothesis testing and confidence intervals thoroughly. Interpret statistical results and communicate findings effectively.',
'Build the statistical foundation essential for data science success. From descriptive statistics to inferential methods, master the mathematical concepts that underpin all advanced analytics and machine learning work.',
'Self-paced progression with interactive exercises and quizzes. Real-world examples from business and research contexts. Comprehensive reference materials for ongoing use.',
'Data science beginners needing statistical foundation. Business analysts seeking quantitative skills. Students preparing for advanced data science courses.',
'High school level mathematics including basic algebra. Curiosity about data-driven decision making. Access to spreadsheet software or basic calculator.',
'eng', 99.99, false, null),

-- Emma Rodriguez (Graphic Design) - Products 9-12
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 9, 0, 0, 1,
'Portfolio Review Session', 
'Receive detailed feedback on portfolio presentation and project selection. Identify strengths and areas for improvement in your design work. Develop strategies for showcasing your skills to potential clients or employers.',
'Get expert critique and guidance on your design portfolio from an experienced creative professional. This personalized session will help you refine your presentation and make your work stand out in the competitive design market.',
'One-on-one personalized feedback from industry professional. Detailed written recommendations for portfolio improvements. Strategic advice for targeting specific design roles.',
'Graphic designers seeking career advancement opportunities. Freelancers wanting to attract better clients. Design students preparing for job applications.',
'Existing portfolio with 5-10 design projects. Basic understanding of design software and principles. Specific career goals or target audience in mind.',
'eng', 125.00, false, null),

('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 9, 1, 0, 1,
'Brand Identity Design Workshop', 
'Create cohesive brand identities from concept to final deliverables. Master logo design principles and brand guideline development. Apply strategic thinking to visual brand communication.',
'Transform ideas into powerful brand identities in this hands-on workshop. Learn the complete process from client brief to brand guidelines, working on real projects with feedback from peers and instructor.',
'Live brand identity projects with real client briefs. Collaborative feedback sessions with fellow designers. Complete brand guidelines template and process documentation.',
'Graphic designers expanding into brand identity work. Marketing professionals seeking design skills. Creative professionals wanting to offer branding services.',
'Proficiency with design software like Illustrator or Photoshop. Basic understanding of typography and color theory. Portfolio showing design fundamentals knowledge.',
'eng', 95.00, true,
(select base from month_1) + INTERVAL '17 days' + time '10:00:00'),

('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 9, 2, 0, 1,
'Adobe Creative Suite Mastery', 
'Master advanced features and workflows in Photoshop, Illustrator, and InDesign. Create professional-quality designs for print and digital media. Optimize workflow efficiency and develop personal design processes.',
'Become proficient in the industry-standard design tools used by creative professionals worldwide. This comprehensive course covers advanced techniques, shortcuts, and workflows that will elevate your design capabilities.',
'Comprehensive coverage of three essential Adobe applications. Project-based learning with real-world design challenges. Workflow optimization techniques for professional efficiency.',
'Designers wanting to master industry-standard software. Creative professionals upgrading their technical skills. Students preparing for design career entry.',
'Basic computer skills and familiarity with design concepts. Access to Adobe Creative Suite subscription. Commitment to hands-on practice and project completion.',
'eng', 399.99, true,
(select base from month_1) + INTERVAL '9 days' + time '09:00:00'),

('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 9, 3, 0, 0,
'Design Principles Basics', 
'Understand fundamental design principles including balance, contrast, and hierarchy. Apply color theory effectively in various design contexts. Develop visual problem-solving skills and design thinking processes.',
'Build a solid foundation in design fundamentals that will inform all your creative work. From composition to color psychology, learn the essential principles that separate good design from great design.',
'Comprehensive foundation covering all core design principles. Practical exercises to reinforce theoretical concepts. Visual examples from successful design campaigns and projects.',
'Complete design beginners starting their creative journey. Non-designers needing visual communication skills. Creative hobbyists wanting to improve their aesthetic sense.',
'No prior design experience necessary. Creative curiosity and willingness to experiment. Access to basic design software or drawing materials.',
'eng', 69.99, false, null),

-- David Thompson (Fitness) - Products 13-15
('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 12, 0, 0, 0,
'Personal Training Session', 
'Develop personalized workout plans tailored to your specific goals. Learn proper form and technique to prevent injuries. Receive motivation and accountability for consistent progress.',
'Get expert guidance and personalized attention from a certified fitness professional. Whether you''re starting your fitness journey or breaking through plateaus, this session will optimize your training approach.',
'Customized workout plan based on your fitness level. One-on-one form correction and technique guidance. Goal-setting and progress tracking strategies included.',
'Fitness beginners needing proper guidance and foundation. Experienced athletes seeking technique refinement. Individuals with specific health or mobility considerations.',
'Basic health clearance for physical activity. Comfortable workout attire and athletic shoes. Clear fitness goals and any health limitations disclosed.',
'eng', 80.00, false, null),

('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 12, 1, 0, 1,
'HIIT Bootcamp Class', 
'Maximize calorie burn through structured high-intensity intervals. Build cardiovascular endurance and muscular strength simultaneously. Master bodyweight exercises and functional movement patterns.',
'Push your limits in this energizing group fitness class designed to torch calories and build strength. Each session combines cardio bursts with strength training for maximum results in minimal time.',
'High-energy group atmosphere with motivating music. Scalable exercises for all fitness levels. Fat-burning workouts that continue post-exercise.',
'Fitness enthusiasts seeking efficient and challenging workouts. Busy professionals wanting maximum results in limited time. Group fitness lovers who thrive on community motivation.',
'Moderate fitness level and ability to perform basic exercises. Medical clearance for high-intensity exercise if over 40. Water bottle and towel for intense workout sessions.',
'eng', 25.00, true, 
(select base from month_1) + INTERVAL '18 days' + time '07:00:00'),

('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 12, 2, 0, 1,
'Complete Fitness Transformation', 
'Achieve sustainable weight loss and muscle building through structured programming. Master meal planning and nutrition strategies for long-term success. Develop consistent exercise habits and mindset shifts.',
'Transform your body and lifestyle with this comprehensive 12-week program combining personalized workouts, nutrition coaching, and mindset training. Get the tools and support needed for lasting change.',
'Complete 12-week structured program with weekly check-ins. Personalized nutrition and meal planning guidance. Access to exclusive workout videos and tracking tools.',
'Individuals committed to significant lifestyle and body composition changes. People who have struggled with consistency in previous fitness attempts. Those ready to invest time and effort in comprehensive transformation.',
'Commitment to 12-week program duration and weekly check-ins. Basic kitchen equipment for meal preparation. Willingness to track food intake and exercise progress.',
'eng', 299.99, true, 
(select base from month_1) + INTERVAL '2 days' + time '07:00:00'),

-- Lisa Anderson (Marketing) - Products 16-19
('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 5, 0, 0, 1,
'Marketing Strategy Consultation', 
'Develop comprehensive marketing strategies tailored to your business goals. Identify target audiences and optimize marketing channel selection. Create actionable roadmaps for measurable growth and ROI improvement.',
'Get expert guidance on developing effective marketing strategies from an experienced digital marketing professional. This personalized session will help you clarify your brand positioning and create data-driven marketing plans.',
'Customized marketing strategy based on your business needs. Competitive analysis and market positioning recommendations. Actionable implementation timeline with measurable KPIs.',
'Business owners seeking marketing direction and strategy. Marketing managers needing expert consultation on campaigns. Entrepreneurs launching new products or services.',
'Basic understanding of your target market and business goals. Current marketing materials and performance data if available. Clear budget parameters and growth objectives.',
'eng', 175.00, false, null),

('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 5, 1, 0, 1,
'Social Media Marketing Mastermind', 
'Master content creation strategies that engage and convert audiences. Develop effective social media advertising campaigns across platforms. Build authentic brand communities and measure social media ROI.',
'Join fellow marketers in this collaborative learning environment focused on social media mastery. Share strategies, analyze successful campaigns, and get feedback on your social media initiatives from peers and experts.',
'Weekly live sessions with peer collaboration and feedback. Platform-specific strategies for Instagram, Facebook, LinkedIn, and TikTok. Access to content templates and campaign analysis tools.',
'Social media managers seeking advanced strategies and peer learning. Small business owners managing their own social presence. Marketing professionals wanting to specialize in social media.',
'Active social media presence for at least 6 months. Basic understanding of social media platforms and analytics. Willingness to share campaigns for group feedback.',
'eng', 79.99, true, 
(select base from month_1) + INTERVAL '22 days' + time '09:00:00'),

('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 5, 2, 0, 1,
'Digital Marketing Fundamentals', 
'Master SEO, PPC, content marketing, and analytics for comprehensive digital presence. Build integrated marketing funnels that convert prospects into customers. Develop data-driven decision making skills for marketing optimization.',
'Build a complete digital marketing foundation with this comprehensive course covering all essential channels and strategies. Learn to create cohesive campaigns that drive real business results across multiple platforms.',
'Complete coverage of all major digital marketing channels. Hands-on projects with real campaign creation and optimization. Industry tools training and certification preparation.',
'Marketing professionals expanding their digital skills. Business owners wanting to manage their own digital marketing. Career changers entering the digital marketing field.',
'Basic business and marketing concepts understanding. Access to Google Analytics and social media business accounts. Commitment to hands-on project completion.',
'eng', 349.99, true, 
(select base from month_1) + INTERVAL '6 days' + time '10:00:00'),

('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 5, 3, 0, 0,
'Email Marketing Essentials', 
'Create compelling email campaigns that drive engagement and conversions. Master segmentation and automation strategies for personalized messaging. Analyze email performance metrics and optimize for better results.',
'Learn the fundamentals of effective email marketing from list building to conversion optimization. This self-paced course covers everything needed to create successful email campaigns that build relationships and drive sales.',
'Self-paced learning with lifetime access to materials. Email templates and automation workflows included. Performance tracking and optimization strategies covered.',
'Small business owners wanting to build customer relationships. Marketing coordinators managing email campaigns. Entrepreneurs seeking cost-effective marketing channels.',
'Basic marketing concepts and customer communication experience. Access to email marketing platform like Mailchimp or ConvertKit. Existing customer list or lead generation strategy.',
'eng', 59.99, false, null),

-- James Wilson (Finance) - Products 20-22
('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 6, 0, 0, 2,
'Investment Portfolio Review', 
'Analyze current portfolio performance and risk allocation strategies. Optimize asset allocation based on your risk tolerance and financial goals. Develop rebalancing strategies and tax-efficient investment approaches.',
'Get professional analysis of your investment portfolio from a certified financial advisor. This comprehensive review will identify opportunities for optimization and help align your investments with your long-term financial objectives.',
'Detailed portfolio analysis with personalized recommendations. Risk assessment and asset allocation optimization strategies. Tax-efficient investment planning and rebalancing guidance.',
'Experienced investors seeking portfolio optimization and professional guidance. High-net-worth individuals wanting sophisticated investment strategies. Retirement planners needing asset allocation expertise.',
'Existing investment portfolio with at least $50,000 in assets. Basic understanding of investment principles and market terminology. Financial statements and investment account access for review.',
'eng', 250.00, false, null),

('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 6, 1, 0, 1,
'Financial Planning Workshop', 
'Create comprehensive retirement plans with realistic savings targets and timelines. Master tax-advantaged account strategies and estate planning basics. Develop emergency fund and debt management strategies.',
'Learn essential financial planning strategies in this collaborative workshop environment. Work alongside peers to create actionable financial plans, share experiences, and get expert guidance on common planning challenges.',
'Interactive group sessions with peer learning and collaboration. Retirement planning calculators and financial planning templates included. Expert guidance on tax strategies and estate planning basics.',
'Working professionals planning for retirement and financial security. Couples wanting to align their financial goals and strategies. Mid-career individuals seeking comprehensive financial planning guidance.',
'Basic understanding of personal finance and budgeting concepts. Current income and expense information for planning exercises. Willingness to discuss financial goals in group setting.',
'eng', 149.99, true, 
(select base from month_1) + INTERVAL '25 days' + time '08:30:00'),

('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 6, 2, 0, 1,
'Investment Fundamentals Course', 
'Master fundamental and technical analysis for informed investment decisions. Understand different asset classes including stocks, bonds, and alternative investments. Develop personal investment strategy and risk management techniques.',
'Build a solid foundation in investment principles and strategies with this comprehensive course. Learn to evaluate investments, manage risk, and create diversified portfolios that align with your financial goals and timeline.',
'Complete coverage of all major investment asset classes and strategies. Hands-on portfolio construction exercises with real market data. Risk management and diversification strategies for long-term success.',
'Investment beginners wanting to build wealth through informed investing. Finance professionals expanding their investment knowledge. Individuals taking control of their retirement and investment planning.',
'Basic math skills and understanding of financial concepts. Access to investment accounts or willingness to open practice accounts. Commitment to completing coursework and investment exercises.',
'eng', 499.99, true, 
(select base from month_1) + INTERVAL '9 days' + time '09:00:00'),

-- Maria Garcia (Spanish) - Products 23-26
('6ba7b815-9dad-11d1-80b4-00c04fd430c8', 16, 0, 0, 1,
'Spanish Conversation Practice', 
'Improve fluency and confidence through targeted conversation practice. Correct pronunciation and develop natural speaking patterns. Build vocabulary for real-world communication scenarios.',
'Practice Spanish conversation with a native speaker in a supportive one-on-one environment. Focus on areas where you need the most improvement while building confidence in your speaking abilities.',
'Personalized conversation topics based on your interests and goals. Native speaker pronunciation guidance and accent reduction. Flexible scheduling to accommodate your availability.',
'Intermediate Spanish learners wanting to improve speaking fluency. Students preparing for Spanish proficiency exams or travel. Professionals needing conversational Spanish for work.',
'Basic Spanish vocabulary and grammar foundation equivalent to 1-2 years study. Willingness to speak and make mistakes in a supportive environment. Clear communication goals and topics of interest.',
'spa', 60.00, false, null),

('6ba7b815-9dad-11d1-80b4-00c04fd430c8', 16, 1, 0, 1,
'Spanish Speaking Circle', 
'Practice Spanish conversation in a supportive group environment with learners at similar levels. Build confidence through peer interaction and collaborative learning. Develop listening skills and cultural understanding.',
'Join fellow Spanish learners in this encouraging group setting designed to improve speaking skills through guided conversation and interactive activities. Practice real-world scenarios while making new friends.',
'Small group sessions with mixed-level peer interaction. Cultural topics and real-world scenarios for practical learning. Supportive environment that encourages speaking practice without fear.',
'Spanish learners at all levels wanting peer practice and community. Shy speakers needing group support to build confidence. Students seeking affordable speaking practice opportunities.',
'Basic Spanish phrases and willingness to participate in group conversations. Open mindset about making mistakes and learning from others. Commitment to regular attendance for continuity.',
'spa', 35.00, true, 
(select base from month_1) + INTERVAL '22 days' + time '07:00:00'),

('6ba7b815-9dad-11d1-80b4-00c04fd430c8', 16, 2, 0, 0,
'Complete Spanish Language Course', 
'Master Spanish from beginner to intermediate level through structured curriculum. Develop all four language skills: speaking, listening, reading, and writing. Achieve conversational fluency for travel and professional use.',
'Transform from Spanish beginner to confident speaker with this comprehensive 16-week program. Learn grammar, vocabulary, and culture through interactive lessons, practice exercises, and real-world applications.',
'Complete structured curriculum from beginner to intermediate level. Interactive lessons with multimedia content and cultural insights. Weekly assessments and personalized feedback on progress.',
'Complete beginners starting their Spanish learning journey. Travelers preparing for Spanish-speaking destinations. Professionals needing Spanish skills for career advancement.',
'No prior Spanish experience necessary - designed for absolute beginners. Commitment to 16-week program duration and weekly study time. Access to computer or mobile device for online materials.',
'spa', 399.99, true, 
(select base from month_1) + INTERVAL '0 days' + time '08:00:00'),

('6ba7b815-9dad-11d1-80b4-00c04fd430c8', 16, 3, 0, 0,
'Spanish Grammar Essentials', 
'Master fundamental Spanish grammar rules including verb conjugations and sentence structure. Understand gender and agreement patterns in Spanish nouns and adjectives. Apply grammar rules correctly in speaking and writing contexts.',
'Build a strong grammatical foundation for Spanish communication with this focused course covering essential grammar concepts. Clear explanations and practice exercises help you understand and apply Spanish grammar rules.',
'Self-paced progression through all essential grammar topics. Interactive exercises with immediate feedback and explanations. Comprehensive grammar reference materials for ongoing use.',
'Spanish learners struggling with grammar concepts and rule application. Students needing structured grammar review before advancing levels. Self-directed learners wanting systematic grammar foundation.',
'Basic Spanish vocabulary of at least 200-300 common words. Familiarity with basic sentence structure and verb concepts. Motivation for self-directed study and practice.',
'spa', 49.99, false, null),

-- Robert Brown (Photography) - Products 27-29
('6ba7b816-9dad-11d1-80b4-00c04fd430c8', 10, 0, 0, 1,
'Photography Portfolio Critique', 
'Receive detailed feedback on composition, technical execution, and artistic vision. Identify strengths and areas for improvement in your photographic style. Develop strategies for creating more impactful and cohesive body of work.',
'Get professional critique of your photography portfolio from an experienced photographer. This personalized session will help you refine your artistic vision and technical skills for stronger, more compelling images.',
'Comprehensive portfolio review with detailed written feedback. Technical and artistic guidance from professional photographer. Specific recommendations for improving composition and visual storytelling.',
'Amateur photographers seeking professional feedback and growth direction. Photography students preparing portfolios for applications or exhibitions. Hobbyists wanting to elevate their photographic skills.',
'Portfolio of 15-20 photographs representing your best work. Basic understanding of photography fundamentals and camera operation. Specific goals for portfolio improvement or career direction.',
'eng', 100.00, false, null),

('6ba7b816-9dad-11d1-80b4-00c04fd430c8', 10, 1, 0, 1,
'Landscape Photography Workshop', 
'Master composition techniques for capturing stunning natural landscapes. Learn optimal camera settings and equipment use for outdoor photography. Develop skills in reading light and weather conditions for dramatic images.',
'Join fellow photographers on location to capture breathtaking landscape images while learning advanced techniques. This hands-on workshop combines instruction with practical shooting experience in beautiful natural settings.',
'On-location shooting experience in stunning natural locations. Small group instruction with personalized guidance. Weather reading and golden hour timing strategies included.',
'Photographers wanting to specialize in landscape and nature photography. Outdoor enthusiasts combining adventure with photography skills. Intermediate photographers ready for challenging shooting conditions.',
'DSLR or mirrorless camera with manual mode capability. Sturdy tripod and weather protection for equipment. Moderate hiking ability for accessing scenic locations.',
'eng', 185.00, true, 
(select base from month_1) + INTERVAL '26 days' + time '10:00:00'),

('6ba7b816-9dad-11d1-80b4-00c04fd430c8', 10, 2, 0, 0,
'Photography Fundamentals Masterclass', 
'Master camera operation including exposure triangle and focusing techniques. Develop strong composition skills using rule of thirds and leading lines. Learn essential post-processing techniques for enhancing your images.',
'Build a comprehensive foundation in photography with this complete course covering technical skills, artistic composition, and digital editing. Perfect for beginners wanting to move beyond automatic camera modes.',
'Complete technical and artistic foundation covering all essential skills. Hands-on shooting assignments with feedback and critique sessions. Lightroom and Photoshop editing techniques included.',
'Photography beginners wanting comprehensive foundational skills training. Camera owners ready to move beyond automatic modes. Hobbyists seeking structured learning to improve their photography.',
'DSLR, mirrorless camera, or advanced smartphone with manual controls. Basic computer skills for editing software learning. Enthusiasm for regular practice and assignment completion.',
'eng', 279.99, true, 
(select base from month_1) + INTERVAL '11 days' + time '11:00:00'),

-- Jennifer Davis (Piano) - Products 30-32
('6ba7b817-9dad-11d1-80b4-00c04fd430c8', 22, 0, 0, 0,
'Private Piano Lesson', 
'Develop proper piano technique and posture for injury prevention and musical expression. Learn music theory fundamentals and sight-reading skills progressively. Create personalized practice routines tailored to your musical goals and skill level.',
'Receive individualized piano instruction tailored to your learning style and musical interests. Whether you''re a complete beginner or returning to piano, these lessons will help you progress at your own pace.',
'Completely personalized instruction based on your goals and interests. Flexible repertoire selection from classical to contemporary styles. Proper technique development to prevent injury and enhance expression.',
'Complete piano beginners starting their musical journey. Adult learners returning to piano after years away. Children and teens developing foundational piano skills.',
'Access to acoustic piano or weighted-key digital piano for practice. Commitment to regular practice between lessons for steady progress. Music stand and basic music notation materials.',
'eng', 85.00, false, null),

('6ba7b817-9dad-11d1-80b4-00c04fd430c8', 22, 1, 0, 1,
'Piano Ensemble Class', 
'Develop ensemble playing skills including listening and rhythmic coordination with other musicians. Learn piano duet and group arrangements across various musical styles. Build confidence performing with others in supportive group environment.',
'Experience the joy of making music with others in this collaborative piano class. Learn to play piano duets and small ensemble pieces while developing essential musical partnership skills.',
'Small group setting for personalized attention and peer learning. Diverse repertoire including classical duets and contemporary arrangements. Performance opportunities to build confidence and stage presence.',
'Intermediate piano students with basic sight-reading abilities. Musicians wanting to develop ensemble and collaborative playing skills. Piano students seeking performance experience in supportive group setting.',
'Intermediate piano skills with ability to read basic sheet music. At least 1-2 years of piano experience or equivalent skill level. Willingness to perform with others and take musical direction.',
'eng', 55.00, true, 
(select base from month_1) + INTERVAL '21 days' + time '09:00:00'),

('6ba7b817-9dad-11d1-80b4-00c04fd430c8', 22, 2, 0, 2,
'Classical Piano Performance Course', 
'Master advanced classical piano repertoire from Baroque through Romantic periods. Develop sophisticated interpretation skills and musical phrasing techniques. Prepare for recital performance with stage presence and confidence building.',
'Elevate your classical piano playing with this intensive course focusing on masterwork repertoire and performance skills. Study pieces by Bach, Mozart, Chopin, and other masters while refining your interpretive abilities.',
'Intensive study of classical masterworks with historical context. Advanced technique development including pedaling and phrasing. Culminating recital performance with professional coaching.',
'Advanced piano students with solid technical foundation seeking classical specialization. Adult learners with intermediate-advanced skills wanting performance experience. Students preparing for conservatory auditions or competitions.',
'Advanced intermediate to advanced piano skills with strong sight-reading ability. Familiarity with classical piano repertoire and music theory. Commitment to intensive practice and performance preparation.',
'eng', 459.99, true,
(select base from month_1) + INTERVAL '4 days' + time '14:00:00'),

-- Thomas Miller (Leadership) - Products 33-35
('6ba7b818-9dad-11d1-80b4-00c04fd430c8', 25, 0, 0, 2,
'Executive Coaching Session', 
'Develop strategic leadership vision and decision-making capabilities for complex business challenges. Enhance emotional intelligence and executive presence for influential leadership. Create actionable leadership development plans aligned with organizational goals.',
'Accelerate your leadership effectiveness with personalized executive coaching from an experienced leadership development professional. Address specific challenges while building the skills needed for senior leadership success.',
'Confidential one-on-one coaching tailored to your specific leadership challenges. 360-degree feedback analysis and personalized development planning. Strategic thinking and decision-making framework development.',
'Senior executives and C-suite leaders seeking performance enhancement. High-potential managers preparing for executive roles. Entrepreneurs scaling their leadership capabilities for business growth.',
'Current leadership role with team management responsibilities. Openness to feedback and commitment to personal development. Specific leadership challenges or goals for focused coaching.',
'eng', 300.00, false, null),

('6ba7b818-9dad-11d1-80b4-00c04fd430c8', 25, 1, 0, 1,
'Leadership Skills Workshop', 
'Master fundamental leadership competencies including communication, delegation, and team motivation. Develop conflict resolution and problem-solving skills for effective team management. Build authentic leadership style based on personal strengths and values.',
'Learn essential leadership skills in this interactive workshop designed for emerging and experienced leaders. Practice real-world scenarios while building confidence in your leadership abilities.',
'Interactive exercises and role-playing for practical skill development. Peer learning opportunities with feedback from fellow participants. Leadership assessment tools and personal action planning.',
'Emerging leaders transitioning into management roles. Experienced managers wanting to strengthen core leadership skills. Team leads and project managers seeking formal leadership training.',
'Current or aspiring leadership role with team interaction responsibilities. Willingness to participate in group exercises and peer feedback. Basic understanding of workplace dynamics and team management.',
'eng', 195.00, true, 
(select base from month_1) + INTERVAL '22 days' + time '08:00:00'),

('6ba7b818-9dad-11d1-80b4-00c04fd430c8', 25, 2, 0, 2,
'Advanced Leadership Development Program', 
'Master strategic leadership including organizational vision, change management, and innovation leadership. Develop advanced communication skills for inspiring and influencing diverse stakeholders. Build executive presence and thought leadership capabilities for industry influence.',
'Transform into an exceptional leader with this comprehensive program covering advanced leadership competencies, strategic thinking, and organizational influence. Perfect for senior leaders ready to make significant impact.',
'Comprehensive 12-week curriculum with weekly live sessions and peer cohorts. Executive mentorship and 360-degree feedback throughout the program. Capstone project involving real organizational leadership challenge.',
'Senior managers and directors preparing for executive advancement. Established leaders seeking to enhance strategic and transformational capabilities. High-potential professionals fast-tracked for senior leadership roles.',
'Minimum 5 years leadership experience with significant team and budget responsibility. Support from current organization for program participation. Commitment to full 12-week program engagement.',
'eng', 899.99, true, 
(select base from month_1) + INTERVAL '0 days' + time '09:00:00'),

-- Amanda Taylor (Mobile Development) - Products 36-38
('6ba7b819-9dad-11d1-80b4-00c04fd430c8', 3, 0, 0, 2,
'Mobile App Code Review', 
'Identify performance bottlenecks and optimize app architecture for scalability and maintainability. Review security implementations and data handling practices for production readiness. Provide actionable recommendations for code quality improvement and best practices adoption.',
'Get expert analysis of your mobile app code from an experienced developer. This comprehensive review will help you improve performance, security, and maintainability while following industry best practices.',
'Detailed code analysis with written recommendations and improvement strategies. Architecture review focusing on scalability and performance optimization. Security audit and best practices guidance for production deployment.',
'Experienced mobile developers seeking expert code review and optimization guidance. Development teams preparing apps for production release or scaling. Independent developers wanting professional validation of their work.',
'Existing mobile app codebase with substantial functionality for meaningful review. Strong programming fundamentals and willingness to implement recommended changes. Specific areas of concern or optimization goals.',
'eng', 180.00, false, null),

('6ba7b819-9dad-11d1-80b4-00c04fd430c8', 3, 1, 0, 1,
'iOS Development Study Group', 
'Master iOS development using Swift and Xcode with hands-on projects and peer collaboration. Build native iOS apps following Apple design guidelines and development best practices. Develop skills in Core Data, networking, and iOS-specific frameworks.',
'Join fellow iOS developers in this collaborative learning environment focused on building real iOS applications. Share knowledge, solve challenges together, and get feedback on your development projects.',
'Weekly hands-on coding sessions with peer collaboration and code reviews. Real iOS project development with App Store submission guidance. Access to iOS development resources and community support.',
'Intermediate programmers wanting to specialize in iOS development. Developers with basic Swift knowledge seeking practical project experience. Mobile development enthusiasts wanting peer learning and community.',
'Solid programming foundation in Swift or similar object-oriented language. Mac computer with Xcode installed for iOS development. Basic understanding of mobile app concepts and user interface design.',
'eng', 110.00, true, 
(select base from month_1) + INTERVAL '22 days' + time '09:00:00'),

('6ba7b819-9dad-11d1-80b4-00c04fd430c8', 3, 2, 0, 1,
'Complete Mobile App Development Course', 
'Master both iOS and Android development using native and cross-platform technologies. Build full-stack mobile applications with backend integration and API development. Deploy applications to App Store and Google Play with proper testing and optimization.',
'Become a complete mobile app developer with this comprehensive course covering iOS, Android, and cross-platform development. Learn to build, test, and deploy professional mobile applications from concept to store.',
'Comprehensive coverage of iOS, Android, and React Native development. Full-stack approach including backend API development and database integration. App store deployment process and marketing fundamentals.',
'Software developers wanting to transition into mobile app development. Web developers seeking to expand into mobile platforms. Computer science students preparing for mobile development careers.',
'Strong programming foundation in at least one language like JavaScript, Java, or Swift. Basic understanding of databases and web APIs. Access to both Mac and PC for cross-platform development.',
'eng', 549.99, true, 
(select base from month_1) + INTERVAL '7 days' + time '10:00:00'),

-- Christopher Moore (Cybersecurity) - Products 39-41
('6ba7b81a-9dad-11d1-80b4-00c04fd430c8', 4, 0, 0, 2,
'Security Assessment Consultation', 
'Conduct comprehensive security audits of network infrastructure and identify critical vulnerabilities. Develop customized security policies and incident response procedures for your organization. Provide strategic recommendations for security tool implementation and staff training.',
'Protect your organization with a professional cybersecurity assessment from a certified security expert. Get actionable insights to strengthen your security posture and reduce risk exposure.',
'Comprehensive security audit with detailed vulnerability assessment and remediation roadmap. Custom security policy development and incident response planning. Strategic guidance on security tool selection and implementation.',
'IT directors and CISOs seeking professional security assessments. Small to medium business owners needing cybersecurity guidance. Organizations preparing for compliance audits or security certifications.',
'Administrative access to systems and networks for thorough assessment. Basic understanding of IT infrastructure and security concepts. Authority to implement recommended security changes and policies.',
'eng', 275.00, false, null),

('6ba7b81a-9dad-11d1-80b4-00c04fd430c8', 4, 1, 0, 2,
'Ethical Hacking Workshop', 
'Master penetration testing methodologies and vulnerability assessment techniques using industry-standard tools. Learn to think like attackers to better defend systems and networks. Develop skills in reconnaissance, exploitation, and security reporting.',
'Learn ethical hacking techniques in this hands-on workshop designed for cybersecurity professionals. Practice penetration testing in controlled environments while developing defensive security mindset.',
'Hands-on penetration testing lab with real-world scenarios. Industry-standard tools training including Metasploit, Nmap, and Burp Suite. Ethical hacking methodology and professional reporting techniques.',
'IT security professionals wanting to develop offensive security skills. Network administrators seeking to understand attack vectors. Cybersecurity students preparing for ethical hacker certifications.',
'Strong networking and systems administration background. Basic understanding of Linux command line and scripting. Commitment to ethical use of hacking knowledge and techniques.',
'eng', 225.00, true, 
(select base from month_1) + INTERVAL '22 days' + time '08:00:00'),

('6ba7b81a-9dad-11d1-80b4-00c04fd430c8', 4, 2, 0, 1,
'Cybersecurity Fundamentals Course', 
'Master essential cybersecurity concepts including threat analysis, risk assessment, and security frameworks. Understand network security principles and implement effective defense strategies. Develop incident response skills and security awareness for organizational protection.',
'Build a comprehensive foundation in cybersecurity with this complete course covering threat landscape, defense strategies, and security management. Perfect for IT professionals entering cybersecurity field.',
'Complete coverage of cybersecurity domains including network security, threat analysis, and compliance. Hands-on labs with security tools and real-world case studies. Preparation for industry certifications like Security+ and CISSP.',
'IT professionals transitioning into cybersecurity careers. Network administrators wanting to specialize in security. Students and career changers entering the cybersecurity field.',
'Solid IT fundamentals including networking and systems administration. Basic understanding of computer systems and network protocols. Commitment to hands-on lab work and certification preparation.',
'eng', 429.99, true, 
(select base from month_1) + INTERVAL '14 days' + time '13:00:00'),

-- Jessica Jackson (Mental Health) - Products 42-44
('6ba7b81b-9dad-11d1-80b4-00c04fd430c8', 14, 0, 0, 0,
'Individual Counseling Session', 
'Develop personalized coping strategies for managing anxiety, depression, and life transitions. Build emotional resilience and self-awareness through evidence-based therapeutic approaches. Create actionable goals for improving mental health and overall well-being.',
'Receive personalized mental health support from a licensed counselor in a confidential and supportive environment. Work through challenges at your own pace with professional guidance tailored to your needs.',
'Confidential one-on-one therapy sessions with licensed mental health professional. Personalized treatment approach based on evidence-based therapeutic methods. Flexible scheduling and safe space for emotional exploration.',
'Individuals experiencing anxiety, depression, or life transitions seeking professional support. Adults wanting to develop better coping strategies and emotional regulation. People interested in personal growth and self-improvement.',
'Willingness to engage in open and honest therapeutic conversation. Commitment to regular sessions for optimal therapeutic progress. No prior therapy experience necessary.',
'eng', 120.00, false, null),

('6ba7b81b-9dad-11d1-80b4-00c04fd430c8', 14, 1, 0, 0,
'Mindfulness Group Therapy', 
'Learn mindfulness meditation techniques for reducing stress and improving emotional regulation. Develop present-moment awareness and acceptance skills for better mental health. Practice guided meditation and mindful breathing in supportive group environment.',
'Join others on a journey toward greater mindfulness and stress reduction. Learn practical meditation techniques while building connections with fellow participants in a supportive group setting.',
'Weekly guided mindfulness meditation sessions with experienced facilitator. Peer support and shared learning experiences in small group setting. Take-home mindfulness exercises and stress reduction techniques.',
'Individuals seeking stress reduction and emotional regulation through mindfulness practice. People interested in meditation but preferring group learning environment. Adults wanting to build mindfulness habits with community support.',
'Openness to mindfulness practices and group participation. No prior meditation experience necessary. Comfortable sitting for 20-30 minute meditation sessions.',
'eng', 65.00, true, 
(select base from month_1) + INTERVAL '22 days' + time '09:00:00'),

('6ba7b81b-9dad-11d1-80b4-00c04fd430c8', 14, 2, 0, 0,
'Stress Management and Wellness Program', 
'Master comprehensive stress management techniques including cognitive behavioral strategies and relaxation methods. Develop sustainable self-care routines and healthy lifestyle habits for long-term wellness. Build resilience skills for managing future challenges and maintaining mental health.',
'Transform your relationship with stress through this comprehensive 8-week program combining evidence-based stress management techniques, wellness practices, and peer support for lasting change.',
'Structured 8-week curriculum with weekly group sessions and individual practice assignments. Comprehensive wellness toolkit including stress management techniques and self-care strategies. Ongoing support and accountability throughout the program.',
'Professionals and individuals experiencing chronic stress seeking comprehensive wellness solutions. People wanting to develop proactive mental health and stress management skills. Adults interested in holistic approach to mental wellness.',
'Commitment to 8-week program participation and weekly practice assignments. Basic stress management awareness and willingness to try new wellness techniques. Openness to group learning and peer support.',
'eng', 249.99, true, 
(select base from month_1) + INTERVAL '2 days' + time '10:00:00'),

-- Daniel Lee (Physics) - Products 45-47
('6ba7b81c-9dad-11d1-80b4-00c04fd430c8', 18, 0, 0, 0,
'Physics Tutoring Session', 
'Master fundamental physics concepts through personalized explanations and problem-solving strategies. Develop mathematical skills essential for physics calculations and formula applications. Build confidence in approaching complex physics problems with systematic methodology.',
'Get personalized physics instruction tailored to your learning style and academic needs. Whether struggling with basic concepts or preparing for advanced exams, these sessions will clarify difficult topics and improve problem-solving skills.',
'Completely personalized instruction based on your specific physics challenges. Step-by-step problem-solving guidance with multiple solution approaches. Exam preparation strategies and concept reinforcement through practice problems.',
'High school and college students struggling with physics concepts and problem-solving. Students preparing for AP Physics, SAT Subject Tests, or college entrance exams. Adult learners returning to physics study for career or personal interest.',
'Basic algebra and trigonometry skills for physics calculations. Current physics coursework or specific topics needing improvement. Physics textbook and calculator for problem-solving practice.',
'eng', 95.00, false, null),

('6ba7b81c-9dad-11d1-80b4-00c04fd430c8', 18, 1, 0, 2,
'Quantum Physics Discussion Group', 
'Explore advanced quantum mechanics concepts including wave-particle duality, quantum entanglement, and measurement theory. Analyze contemporary quantum physics research and experimental findings through collaborative discussion. Develop deeper understanding of quantum interpretations and philosophical implications.',
'Join fellow physics enthusiasts in exploring the fascinating world of quantum mechanics. Engage in thought-provoking discussions about quantum phenomena while deepening your understanding of this revolutionary field.',
'Advanced discussion sessions with peer collaboration and expert guidance. Current quantum physics research topics and experimental developments. Philosophical exploration of quantum mechanics interpretations and implications.',
'Physics students with solid foundation in calculus-based physics seeking advanced quantum mechanics understanding. Graduate students and researchers wanting collaborative quantum physics exploration. Physics enthusiasts interested in cutting-edge quantum developments.',
'Strong background in calculus-based physics including electricity, magnetism, and waves. Basic understanding of linear algebra and differential equations. Familiarity with fundamental quantum concepts.',
'eng', 85.00, true, 
(select base from month_1) + INTERVAL '23 days' + time '10:00:00'),

('6ba7b81c-9dad-11d1-80b4-00c04fd430c8', 18, 2, 0, 1,
'Introduction to Modern Physics', 
'Master special and general relativity concepts including time dilation, length contraction, and spacetime curvature. Understand quantum mechanics fundamentals including wave functions, uncertainty principle, and atomic structure. Develop mathematical framework for modern physics applications and problem-solving.',
'Discover the revolutionary concepts of modern physics that transformed our understanding of the universe. This comprehensive course covers relativity and quantum mechanics with clear explanations and practical applications.',
'Complete coverage of special relativity, general relativity, and quantum mechanics fundamentals. Mathematical development with step-by-step derivations and problem-solving techniques. Historical context and experimental evidence for modern physics theories.',
'Physics students transitioning from classical to modern physics concepts. Engineering students needing modern physics foundation for advanced courses. Science enthusiasts wanting rigorous introduction to relativity and quantum mechanics.',
'Solid foundation in calculus-based classical physics including mechanics and electromagnetism. Proficiency in calculus and basic differential equations. Strong mathematical problem-solving skills.',
'eng', 379.99, true, 
(select base from month_1) + INTERVAL '6 days' + time '15:00:00'),

-- Rachel White (Guitar) - Products 48-50
('6ba7b81d-9dad-11d1-80b4-00c04fd430c8', 23, 0, 0, 0,
'Private Guitar Lesson', 
'Develop proper guitar technique including fingerpicking, strumming patterns, and fretting hand positioning. Learn music theory fundamentals applied to guitar fretboard and chord progressions. Build repertoire in your preferred musical styles from classical to contemporary.',
'Receive personalized guitar instruction tailored to your musical interests and skill level. Whether you''re a complete beginner or looking to refine advanced techniques, these lessons will help you achieve your guitar goals.',
'Completely customized instruction based on your musical preferences and goals. Proper technique development to prevent injury and enhance musical expression. Flexible repertoire selection across all guitar styles and genres.',
'Complete guitar beginners starting their musical journey. Intermediate players wanting to improve technique and expand repertoire. Adult learners pursuing guitar as hobby or returning after time away.',
'Access to acoustic or electric guitar in good playing condition. Guitar picks, tuner, and basic accessories for lessons. Commitment to regular practice between lessons for steady progress.',
'eng', 75.00, false, null),

('6ba7b81d-9dad-11d1-80b4-00c04fd430c8', 23, 1, 0, 1,
'Guitar Jam Session', 
'Develop ensemble playing skills including rhythm guitar, lead guitar, and collaborative improvisation. Learn to play popular songs in group setting while building confidence and stage presence. Practice listening skills and musical communication with other guitarists.',
'Join fellow guitarists for fun and educational jam sessions focused on playing popular songs and improvising together. Build confidence while learning from other players in a supportive musical community.',
'Small group sessions with peer learning and collaborative music-making. Popular song repertoire across multiple genres including rock, blues, and folk. Improvisation skills development and performance confidence building.',
'Intermediate guitar players with basic chord knowledge and strumming ability. Musicians wanting to develop ensemble playing and jamming skills. Guitar students seeking performance experience in supportive group environment.',
'Intermediate guitar skills including basic open chords and simple strumming patterns. At least 6 months of guitar playing experience or equivalent skill level. Willingness to play with others and learn collaboratively.',
'eng', 45.00, true, 
(select base from month_1) + INTERVAL '22 days' + time '12:00:00'),

('6ba7b81d-9dad-11d1-80b4-00c04fd430c8', 23, 2, 0, 1,
'Complete Guitar Mastery Course', 
'Master advanced guitar techniques including barre chords, fingerstyle playing, and advanced rhythm patterns. Develop comprehensive music theory knowledge applied to guitar fretboard navigation and improvisation. Build performance skills through solo and ensemble repertoire across multiple musical styles.',
'Transform into a well-rounded guitarist with this comprehensive 16-week program covering technique, theory, and performance skills. Perfect for dedicated students wanting to achieve guitar mastery.',
'Structured 16-week curriculum progressing from intermediate to advanced techniques. Music theory integration with practical guitar application and fretboard mastery. Performance preparation with solo and ensemble repertoire development.',
'Intermediate guitar players ready to commit to intensive skill development. Musicians wanting comprehensive guitar education and performance preparation. Students preparing for music school auditions or professional performance.',
'Solid intermediate guitar foundation including open chords, basic scales, and rhythm playing. Commitment to 16-week program duration and daily practice routine. Music reading ability helpful but not required.',
'eng', 389.99, true,
(select base from month_1) + INTERVAL '0 days' + time '13:00:00');

-- Private Session Products (Type 0)
insert into private_session_product (product_id, duration_min) values 
(1, 60),   -- Sarah's Web Dev Consultation
(5, 90),   -- Michael's Data Science Coaching
(9, 45),   -- Emma's Portfolio Review
(13, 60),  -- David's Personal Training
(16, 90),  -- Lisa's Marketing Consultation
(20, 120), -- James' Investment Portfolio Review
(23, 60),  -- Maria's Spanish Conversation
(27, 75),  -- Robert's Photography Critique
(30, 45),  -- Jennifer's Piano Lesson
(33, 90),  -- Thomas' Executive Coaching
(36, 90),  -- Amanda's App Code Review
(39, 120), -- Christopher's Security Assessment
(42, 50),  -- Jessica's Counseling Session
(45, 60),  -- Daniel's Physics Tutoring
(48, 45);  -- Rachel's Guitar Lesson

-- Group Session Products (Type 1)
insert into group_session_product (product_id, duration_min, max_participants) values 
(2, 180, 12),  -- Sarah's React Workshop
(6, 120, 15),  -- Michael's ML Study Group
(10, 150, 10), -- Emma's Brand Identity Workshop
(14, 45, 20),  -- David's HIIT Bootcamp
(17, 90, 25),  -- Lisa's Social Media Mastermind
(21, 120, 12), -- James' Financial Planning Workshop
(24, 60, 8),   -- Maria's Spanish Speaking Circle
(28, 240, 6),  -- Robert's Landscape Photography Workshop
(31, 90, 8),   -- Jennifer's Piano Ensemble
(34, 180, 15), -- Thomas' Leadership Workshop
(37, 120, 10), -- Amanda's iOS Study Group
(40, 240, 8),  -- Christopher's Ethical Hacking Workshop
(43, 75, 12),  -- Jessica's Mindfulness Group
(46, 90, 15),  -- Daniel's Quantum Physics Group
(49, 90, 6);   -- Rachel's Guitar Jam Session

-- Online Course Products (Type 2)
with
    month_1 as (select DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') as base),
    month_2 as (select DATE_TRUNC('month', CURRENT_DATE + INTERVAL '2 months') as base)
insert into online_course_product (product_id, max_participants, start_time, end_time) values 
(3, 50, (select base from month_1) + INTERVAL '2 days' + time '10:00:00', (select base from month_2) + INTERVAL '17 days' + time '16:10:00'),   -- Sarah's Full-Stack Bootcamp
(7, 30, (select base from month_1) + INTERVAL '4 days' + time '14:00:00', (select base from month_2) + INTERVAL '21 days' + time '16:00:00'),   -- Michael's Python for DS
(11, 25, (select base from month_1) + INTERVAL '9 days' + time '09:00:00', (select base from month_2) + INTERVAL '19 days' + time '17:00:00'),  -- Emma's Adobe Mastery
(15, 40, (select base from month_1) + INTERVAL '2 days' + time '07:00:00', (select base from month_2) + INTERVAL '16 days' + time '19:00:00'),  -- David's Fitness Transformation
(18, 35, (select base from month_1) + INTERVAL '6 days' + time '10:00:00', (select base from month_2) + INTERVAL '15 days' + time '16:00:00'),  -- Lisa's Digital Marketing
(22, 20, (select base from month_1) + INTERVAL '9 days' + time '09:00:00', (select base from month_2) + INTERVAL '14 days' + time '15:00:00'),  -- James' Investment Course
(25, 45, (select base from month_1) + INTERVAL '0 days' + time '08:00:00', (select base from month_2) + INTERVAL '27 days' + time '20:00:00'),  -- Maria's Complete Spanish
(29, 15, (select base from month_1) + INTERVAL '11 days' + time '11:00:00', (select base from month_2) + INTERVAL '16 days' + time '17:00:00'),  -- Robert's Photography Masterclass
(32, 12, (select base from month_1) + INTERVAL '4 days' + time '14:00:00', (select base from month_2) + INTERVAL '23 days' + time '19:00:00'),  -- Jennifer's Classical Piano
(35, 25, (select base from month_1) + INTERVAL '0 days' + time '09:00:00', (select base from month_2) + INTERVAL '23 days' + time '16:00:00'),  -- Thomas' Leadership Program
(38, 20, (select base from month_1) + INTERVAL '7 days' + time '10:00:00', (select base from month_2) + INTERVAL '15 days' + time '18:00:00'),  -- Amanda's Mobile Dev Course
(41, 18, (select base from month_1) + INTERVAL '14 days' + time '13:00:00', (select base from month_2) + INTERVAL '26 days' + time '17:00:00'),  -- Christopher's Cybersecurity
(44, 30, (select base from month_1) + INTERVAL '2 days' + time '10:00:00', (select base from month_2) + INTERVAL '15 days' + time '16:00:00'),  -- Jessica's Wellness Program
(47, 22, (select base from month_1) + INTERVAL '6 days' + time '15:00:00', (select base from month_2) + INTERVAL '21 day' + time '18:00:00'),  -- Daniel's Modern Physics
(50, 15, (select base from month_1) + INTERVAL '0 days' + time '13:00:00', (select base from month_2) + INTERVAL '20 days' + time '20:00:00');  -- Rachel's Guitar Mastery

-- Modules for Online Courses
insert into module (product_id, title, description, sort_order) values 
-- Sarah's Full-Stack Bootcamp (product_id = 3)
(3, 'Frontend Fundamentals', 'HTML, CSS, and JavaScript basics', 1),
(3, 'React Development', 'Building interactive user interfaces with React', 2),
(3, 'Backend Development', 'Node.js and Express server development', 3),
(3, 'Database Integration', 'Working with databases and APIs', 4),

-- Michael's Python for Data Science (product_id = 7)
(7, 'Python Basics', 'Python syntax and data structures', 1),
(7, 'Data Manipulation', 'Pandas and NumPy for data analysis', 2),
(7, 'Data Visualization', 'Creating charts and graphs with Matplotlib', 3),
(7, 'Machine Learning', 'Introduction to scikit-learn and ML algorithms', 4),

-- Emma's Adobe Mastery (product_id = 11)
(11, 'Photoshop Essentials', 'Photo editing and digital art fundamentals', 1),
(11, 'Illustrator Mastery', 'Vector graphics and logo design', 2),
(11, 'InDesign Layout', 'Print and digital layout design', 3),

-- David's Fitness Transformation (product_id = 15)
(15, 'Fitness Assessment', 'Understanding your current fitness level', 1),
(15, 'Strength Training', 'Building muscle and increasing strength', 2),
(15, 'Cardio & Conditioning', 'Improving cardiovascular health', 3),
(15, 'Nutrition Planning', 'Meal planning and dietary guidelines', 4),

-- Lisa's Digital Marketing (product_id = 18)
(18, 'Marketing Strategy', 'Developing effective marketing plans', 1),
(18, 'Social Media Marketing', 'Leveraging social platforms for business', 2),
(18, 'Content Marketing', 'Creating engaging content that converts', 3),
(18, 'Analytics & Optimization', 'Measuring and improving campaign performance', 4),

-- James' Investment Course (product_id = 22)
(22, 'Investment Basics', 'Understanding different investment types', 1),
(22, 'Portfolio Management', 'Building and managing investment portfolios', 2),
(22, 'Risk Assessment', 'Evaluating and managing investment risks', 3),

-- Maria's Complete Spanish (product_id = 25)
(25, 'Spanish Foundations', 'Basic grammar and vocabulary', 1),
(25, 'Conversational Spanish', 'Practical speaking and listening skills', 2),
(25, 'Advanced Grammar', 'Complex tenses and sentence structures', 3),
(25, 'Cultural Context', 'Understanding Spanish-speaking cultures', 4),

-- Robert's Photography Masterclass (product_id = 29)
(29, 'Camera Fundamentals', 'Understanding exposure and camera settings', 1),
(29, 'Composition Techniques', 'Creating visually compelling images', 2),
(29, 'Post-Processing', 'Editing and enhancing your photographs', 3),

-- Jennifer's Classical Piano (product_id = 32)
(32, 'Piano Technique', 'Proper posture and finger positioning', 1),
(32, 'Classical Repertoire', 'Learning famous classical pieces', 2),
(32, 'Music Theory', 'Understanding harmony and musical structure', 3),
(32, 'Performance Skills', 'Preparing for recitals and performances', 4),

-- Thomas' Leadership Program (product_id = 35)
(35, 'Leadership Fundamentals', 'Core principles of effective leadership', 1),
(35, 'Team Management', 'Building and leading high-performance teams', 2),
(35, 'Communication Skills', 'Effective communication and presentation', 3),
(35, 'Strategic Thinking', 'Developing long-term vision and strategy', 4),

-- Amanda's Mobile Dev Course (product_id = 38)
(38, 'Mobile Development Basics', 'Introduction to mobile app development', 1),
(38, 'iOS Development', 'Building apps for iPhone and iPad', 2),
(38, 'Android Development', 'Creating Android applications', 3),
(38, 'App Store Deployment', 'Publishing and marketing your apps', 4),

-- Christopher's Cybersecurity (product_id = 41)
(41, 'Security Fundamentals', 'Basic cybersecurity concepts and threats', 1),
(41, 'Network Security', 'Protecting networks and infrastructure', 2),
(41, 'Ethical Hacking', 'Penetration testing and vulnerability assessment', 3),

-- Jessica's Wellness Program (product_id = 44)
(44, 'Stress Identification', 'Recognizing sources and signs of stress', 1),
(44, 'Mindfulness Techniques', 'Meditation and mindfulness practices', 2),
(44, 'Coping Strategies', 'Healthy ways to manage stress and anxiety', 3),
(44, 'Lifestyle Changes', 'Creating sustainable wellness habits', 4),

-- Daniel's Modern Physics (product_id = 47)
(47, 'Special Relativity', 'Theory of special relativity', 1),
(47, 'Quantum Mechanics', 'Fundamental principles of quantum physics', 2),
(47, 'Particle Physics', 'Elementary particles and fundamental forces', 3),

-- Rachel's Guitar Mastery (product_id = 50)
(50, 'Guitar Fundamentals', 'Basic chords and strumming patterns', 1),
(50, 'Music Theory for Guitar', 'Scales, modes, and chord progressions', 2),
(50, 'Advanced Techniques', 'Fingerpicking, bending, and advanced skills', 3),
(50, 'Performance Preparation', 'Stage presence and performance skills', 4);

-- Lessons for each module (2+ lessons per module)
insert into lesson (module_id, title, description, duration_min, sort_order) values 
-- Sarah's Full-Stack Bootcamp Lessons
-- Module 1: Frontend Fundamentals
(1, 'HTML Structure and Semantics', 'Learning proper HTML structure and semantic elements', 90, 1),
(1, 'CSS Styling and Layouts', 'Styling websites with CSS and creating responsive layouts', 120, 2),
(1, 'JavaScript Fundamentals', 'Variables, functions, and control structures in JavaScript', 120, 3),

-- Module 2: React Development  
(2, 'React Components and Props', 'Building reusable components and passing data', 90, 1),
(2, 'State Management and Hooks', 'Managing component state with React hooks', 120, 2),
(2, 'React Router and Navigation', 'Creating single-page applications with routing', 90, 3),

-- Module 3: Backend Development
(3, 'Node.js and Express Setup', 'Setting up a Node.js server with Express', 90, 1),
(3, 'RESTful API Development', 'Creating REST APIs and handling HTTP requests', 120, 2),
(3, 'Authentication and Security', 'Implementing user authentication and security measures', 120, 3),

-- Module 4: Database Integration
(4, 'Database Design and MongoDB', 'Designing databases and working with MongoDB', 120, 1),
(4, 'API Integration and Testing', 'Connecting frontend to backend and testing APIs', 90, 2),

-- Michael's Python for Data Science Lessons
-- Module 5: Python Basics
(5, 'Python Syntax and Data Types', 'Understanding Python syntax and basic data types', 90, 1),
(5, 'Control Structures and Functions', 'Loops, conditionals, and function definitions', 90, 2),

-- Module 6: Data Manipulation
(6, 'Introduction to Pandas', 'Working with DataFrames and data manipulation', 120, 1),
(6, 'NumPy for Numerical Computing', 'Array operations and mathematical functions', 90, 2),
(6, 'Data Cleaning and Preprocessing', 'Handling missing data and data transformation', 120, 3),

-- Module 7: Data Visualization
(7, 'Matplotlib Basics', 'Creating basic plots and charts', 90, 1),
(7, 'Advanced Visualizations', 'Complex plots and statistical visualizations', 120, 2),

-- Module 8: Machine Learning
(8, 'ML Fundamentals and Scikit-learn', 'Introduction to machine learning concepts', 120, 1),
(8, 'Supervised Learning Algorithms', 'Classification and regression techniques', 120, 2),

-- Emma's Adobe Mastery Lessons
-- Module 9: Photoshop Essentials
(9, 'Photoshop Interface and Tools', 'Navigating Photoshop and understanding tools', 90, 1),
(9, 'Photo Editing Techniques', 'Color correction, retouching, and enhancement', 120, 2),
(9, 'Digital Art Creation', 'Creating digital artwork from scratch', 120, 3),

-- Module 10: Illustrator Mastery
(10, 'Vector Graphics Basics', 'Understanding vectors and basic shapes', 90, 1),
(10, 'Logo Design Process', 'Creating professional logos and branding', 120, 2),

-- Module 11: InDesign Layout
(11, 'Layout Fundamentals', 'Typography and page layout principles', 90, 1),
(11, 'Print and Digital Publishing', 'Preparing documents for print and digital', 120, 2),

-- David's Fitness Transformation Lessons
-- Module 12: Fitness Assessment
(12, 'Body Composition Analysis', 'Understanding your current fitness level', 60, 1),
(12, 'Goal Setting and Planning', 'Creating realistic fitness goals and timelines', 90, 2),

-- Module 13: Strength Training
(13, 'Proper Form and Technique', 'Learning correct exercise form to prevent injury', 90, 1),
(13, 'Progressive Overload Principles', 'Gradually increasing training intensity', 90, 2),
(13, 'Strength Training Programs', 'Designing effective workout routines', 120, 3),

-- Module 14: Cardio & Conditioning
(14, 'Cardiovascular Training Methods', 'Different types of cardio and their benefits', 90, 1),
(14, 'HIIT and Circuit Training', 'High-intensity interval training techniques', 90, 2),

-- Module 15: Nutrition Planning
(15, 'Macronutrient Basics', 'Understanding proteins, carbs, and fats', 90, 1),
(15, 'Meal Planning and Prep', 'Creating sustainable meal plans', 120, 2),

-- Lisa's Digital Marketing Lessons
-- Module 16: Marketing Strategy
(16, 'Market Research and Analysis', 'Understanding your target audience', 90, 1),
(16, 'Brand Positioning and Messaging', 'Developing compelling brand messages', 120, 2),

-- Module 17: Social Media Marketing
(17, 'Platform-Specific Strategies', 'Optimizing content for different social platforms', 90, 1),
(17, 'Social Media Advertising', 'Creating and managing paid social campaigns', 120, 2),

-- Module 18: Content Marketing
(18, 'Content Strategy Development', 'Planning and creating valuable content', 120, 1),
(18, 'SEO and Content Optimization', 'Optimizing content for search engines', 90, 2),

-- Module 19: Analytics & Optimization
(19, 'Google Analytics Setup', 'Setting up and configuring analytics tracking', 90, 1),
(19, 'Campaign Performance Analysis', 'Measuring and improving marketing ROI', 120, 2),

-- James' Investment Course Lessons
-- Module 20: Investment Basics
(20, 'Types of Investments', 'Stocks, bonds, and alternative investments', 120, 1),
(20, 'Risk and Return Principles', 'Understanding the risk-return relationship', 90, 2),

-- Module 21: Portfolio Management
(21, 'Asset Allocation Strategies', 'Diversifying your investment portfolio', 120, 1),
(21, 'Rebalancing and Monitoring', 'Maintaining optimal portfolio allocation', 90, 2),

-- Module 22: Risk Assessment
(22, 'Risk Tolerance Evaluation', 'Determining your personal risk tolerance', 90, 1),
(22, 'Risk Management Techniques', 'Strategies to minimize investment risks', 120, 2),

-- Maria's Complete Spanish Lessons
-- Module 23: Spanish Foundations
(23, 'Spanish Alphabet and Pronunciation', 'Mastering Spanish sounds and pronunciation', 90, 1),
(23, 'Basic Grammar and Sentence Structure', 'Fundamental grammar rules and patterns', 120, 2),
(23, 'Essential Vocabulary', 'Common words and phrases for daily communication', 90, 3),

-- Module 24: Conversational Spanish
(24, 'Everyday Conversations', 'Practical dialogues for common situations', 90, 1),
(24, 'Listening Comprehension', 'Understanding spoken Spanish at natural speed', 90, 2),

-- Module 25: Advanced Grammar
(25, 'Complex Tenses and Moods', 'Subjunctive, conditional, and advanced tenses', 120, 1),
(25, 'Advanced Sentence Structures', 'Complex grammar and sophisticated expression', 120, 2),

-- Module 26: Cultural Context
(26, 'Hispanic Cultures and Traditions', 'Understanding cultural contexts and customs', 90, 1),
(26, 'Regional Variations', 'Differences between Spanish-speaking countries', 90, 2),

-- Robert's Photography Masterclass Lessons
-- Module 27: Camera Fundamentals
(27, 'Exposure Triangle Mastery', 'Understanding aperture, shutter speed, and ISO', 120, 1),
(27, 'Camera Settings and Modes', 'Manual mode and creative controls', 90, 2),

-- Module 28: Composition Techniques
(28, 'Rule of Thirds and Beyond', 'Classical and modern composition principles', 90, 1),
(28, 'Lighting and Mood', 'Working with natural and artificial light', 120, 2),

-- Module 29: Post-Processing
(29, 'Lightroom Workflow', 'Organizing and editing photos in Lightroom', 120, 1),
(29, 'Advanced Editing Techniques', 'Color grading and artistic post-processing', 120, 2),

-- Jennifer's Classical Piano Lessons
-- Module 30: Piano Technique
(30, 'Proper Posture and Hand Position', 'Fundamental physical techniques', 90, 1),
(30, 'Scales and Arpeggios', 'Building finger strength and dexterity', 90, 2),

-- Module 31: Classical Repertoire
(31, 'Baroque Period Pieces', 'Bach and other Baroque composers', 120, 1),
(31, 'Romantic Era Classics', 'Chopin, Liszt, and Romantic period works', 120, 2),

-- Module 32: Music Theory
(32, 'Harmony and Chord Progressions', 'Understanding musical harmony', 90, 1),
(32, 'Analysis of Classical Forms', 'Sonata form, fugue, and other structures', 120, 2),

-- Module 33: Performance Skills
(33, 'Stage Presence and Confidence', 'Performing with confidence and poise', 90, 1),
(33, 'Memorization Techniques', 'Strategies for memorizing complex pieces', 90, 2),

-- Thomas' Leadership Program Lessons
-- Module 34: Leadership Fundamentals
(34, 'Leadership Styles and Approaches', 'Different leadership models and when to use them', 120, 1),
(34, 'Emotional Intelligence', 'Developing self-awareness and empathy', 90, 2),

-- Module 35: Team Management
(35, 'Building High-Performance Teams', 'Creating effective team dynamics', 120, 1),
(35, 'Conflict Resolution', 'Managing and resolving team conflicts', 90, 2),

-- Module 36: Communication Skills
(36, 'Effective Presentation Skills', 'Delivering compelling presentations', 120, 1),
(36, 'Difficult Conversations', 'Handling challenging communication situations', 90, 2),

-- Module 37: Strategic Thinking
(37, 'Vision and Strategy Development', 'Creating long-term organizational vision', 120, 1),
(37, 'Change Management', 'Leading organizational change effectively', 120, 2),

-- Amanda's Mobile Dev Course Lessons
-- Module 38: Mobile Development Basics
(38, 'Mobile App Architecture', 'Understanding mobile app design patterns', 120, 1),
(38, 'User Interface Design', 'Creating intuitive mobile interfaces', 90, 2),

-- Module 39: iOS Development
(39, 'Swift Programming Language', 'Learning Swift syntax and features', 120, 1),
(39, 'iOS App Development', 'Building native iOS applications', 120, 2),

-- Module 40: Android Development
(40, 'Kotlin Programming', 'Modern Android development with Kotlin', 120, 1),
(40, 'Android App Architecture', 'Building robust Android applications', 120, 2),

-- Module 41: App Store Deployment
(41, 'App Store Submission Process', 'Publishing apps to App Store and Google Play', 90, 1),
(41, 'App Marketing and Monetization', 'Strategies for app success', 120, 2),

-- Christopher's Cybersecurity Lessons
-- Module 42: Security Fundamentals
(42, 'Cybersecurity Threat Landscape', 'Understanding current security threats', 120, 1),
(42, 'Security Policies and Procedures', 'Developing security frameworks', 90, 2),

-- Module 43: Network Security
(43, 'Network Architecture Security', 'Securing network infrastructure', 120, 1),
(43, 'Firewall and IDS Configuration', 'Implementing network security controls', 120, 2),

-- Module 44: Ethical Hacking
(44, 'Penetration Testing Methodology', 'Systematic approach to security testing', 120, 1),
(44, 'Vulnerability Assessment', 'Identifying and prioritizing security weaknesses', 120, 2),

-- Jessica's Wellness Program Lessons
-- Module 45: Stress Identification
(45, 'Signs and Symptoms of Stress', 'Recognizing physical and emotional stress indicators', 90, 1),
(45, 'Stress Triggers and Patterns', 'Identifying personal stress triggers', 90, 2),

-- Module 46: Mindfulness Techniques
(46, 'Meditation Fundamentals', 'Basic meditation practices and techniques', 90, 1),
(46, 'Mindful Daily Living', 'Incorporating mindfulness into daily activities', 90, 2),

-- Module 47: Coping Strategies
(47, 'Healthy Coping Mechanisms', 'Developing positive stress management strategies', 120, 1),
(47, 'Cognitive Behavioral Techniques', 'Changing thought patterns and behaviors', 90, 2),

-- Module 48: Lifestyle Changes
(48, 'Work-Life Balance', 'Creating sustainable life balance', 90, 1),
(48, 'Building Resilience', 'Developing mental and emotional resilience', 120, 2),

-- Daniel's Modern Physics Lessons
-- Module 49: Special Relativity
(49, 'Time Dilation and Length Contraction', 'Understanding relativistic effects', 120, 1),
(49, 'Mass-Energy Equivalence', 'E=mc² and its implications', 90, 2),

-- Module 50: Quantum Mechanics
(50, 'Wave-Particle Duality', 'Understanding quantum nature of matter and energy', 120, 1),
(50, 'Uncertainty Principle', 'Heisenberg uncertainty and quantum measurements', 90, 2),

-- Module 51: Particle Physics
(51, 'Standard Model of Particles', 'Elementary particles and fundamental forces', 120, 1),
(51, 'Particle Accelerators and Detection', 'How we study subatomic particles', 90, 2),

-- Rachel's Guitar Mastery Lessons
-- Module 52: Guitar Fundamentals
(52, 'Basic Chords and Progressions', 'Essential open chords and chord changes', 90, 1),
(52, 'Strumming Patterns and Rhythm', 'Developing timing and rhythm skills', 90, 2),

-- Module 53: Music Theory for Guitar
(53, 'Scales and Modes', 'Major and minor scales on guitar', 120, 1),
(53, 'Chord Construction and Progressions', 'Understanding how chords work together', 90, 2),

-- Module 54: Advanced Techniques
(54, 'Fingerpicking Patterns', 'Classical and contemporary fingerpicking', 120, 1),
(54, 'Bending and Vibrato', 'Expressive techniques for lead guitar', 90, 2),

-- Module 55: Performance Preparation
(55, 'Stage Presence and Confidence', 'Performing with confidence and charisma', 90, 1),
(55, 'Recording and Production', 'Home recording techniques and tips', 120, 2);

commit;