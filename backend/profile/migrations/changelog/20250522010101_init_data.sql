begin;

insert into user_profile (id, username, first_name, last_name, bio, birth_date, created_date) values 
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'sarah_j', 'Sarah', 'Johnson', 'Passionate web developer with 8 years of experience in full-stack development.', '1985-03-15', '2025-01-15 10:30:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'michael_c', 'Michael', 'Chen', 'Data scientist and machine learning expert with PhD in Computer Science.', '1982-07-22', '2025-01-16 14:20:00+00'),
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'emma_r', 'Emma', 'Rodriguez', 'Professional graphic designer and digital artist with 10+ years experience.', '1987-11-08', '2025-01-17 09:15:00+00'),
('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'david_t', 'David', 'Thompson', 'Certified fitness trainer and nutrition specialist helping people achieve their goals.', '1990-04-12', '2025-01-18 16:45:00+00'),
('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 'lisa_a', 'Lisa', 'Anderson', 'Marketing strategist with expertise in digital marketing and brand development.', '1983-09-30', '2025-01-19 11:00:00+00'),
('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 'james_w', 'James', 'Wilson', 'Financial advisor and investment consultant with CFA certification.', '1981-12-05', '2025-01-20 13:30:00+00'),
('6ba7b815-9dad-11d1-80b4-00c04fd430c8', 'maria_g', 'Maria', 'Garcia', 'Native Spanish speaker and certified language instructor with 12 years experience.', '1986-06-18', '2025-01-21 08:45:00+00'),
('6ba7b816-9dad-11d1-80b4-00c04fd430c8', 'robert_b', 'Robert', 'Brown', 'Professional photographer specializing in portrait and landscape photography.', '1984-02-28', '2025-01-22 15:20:00+00'),
('6ba7b817-9dad-11d1-80b4-00c04fd430c8', 'jennifer_d', 'Jennifer', 'Davis', 'Classical pianist and music theory educator with Masters in Music Performance.', '1988-10-14', '2025-01-23 12:10:00+00'),
('6ba7b818-9dad-11d1-80b4-00c04fd430c8', 'thomas_m', 'Thomas', 'Miller', 'Leadership coach and executive consultant helping professionals grow their careers.', '1979-08-07', '2025-01-24 17:00:00+00'),
('6ba7b819-9dad-11d1-80b4-00c04fd430c8', 'amanda_t', 'Amanda', 'Taylor', 'Mobile app developer specializing in iOS and Android development.', '1989-05-25', '2025-01-25 10:15:00+00'),
('6ba7b81a-9dad-11d1-80b4-00c04fd430c8', 'christopher_m', 'Christopher', 'Moore', 'Cybersecurity expert and ethical hacker with CISSP certification.', '1985-01-19', '2025-01-26 14:40:00+00'),
('6ba7b81b-9dad-11d1-80b4-00c04fd430c8', 'jessica_j', 'Jessica', 'Jackson', 'Mental health counselor and mindfulness coach helping people find balance.', '1987-03-11', '2025-01-27 09:25:00+00'),
('6ba7b81c-9dad-11d1-80b4-00c04fd430c8', 'daniel_l', 'Daniel', 'Lee', 'Physics professor and science communicator making complex topics accessible.', '1983-11-03', '2025-01-28 16:55:00+00'),
('6ba7b81d-9dad-11d1-80b4-00c04fd430c8', 'rachel_w', 'Rachel', 'White', 'Guitar instructor and music composer with 15+ years of teaching experience.', '1986-07-16', '2025-01-29 11:35:00+00');

insert into educator_profile (user_profile_id, bio, experience, status, has_product, created_date) values 
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Specializing in React, Node.js, and cloud technologies. Helped 500+ students launch their tech careers.', '8 years of industry experience, 5 years teaching', 1, true, '2025-01-15 10:30:00+00'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Expert in Python, R, and machine learning frameworks. Published researcher with 20+ papers.', '10 years in data science, 6 years teaching', 1, true, '2025-01-16 14:20:00+00'),
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', 'Adobe Certified Expert in Photoshop, Illustrator, and InDesign. Award-winning designer.', '12 years professional design, 7 years teaching', 1, true, '2025-01-17 09:15:00+00'),
('6ba7b812-9dad-11d1-80b4-00c04fd430c8', 'NASM certified trainer with specialization in strength training and nutrition planning.', '8 years personal training, 4 years group fitness', 1, true, '2025-01-18 16:45:00+00'),
('6ba7b813-9dad-11d1-80b4-00c04fd430c8', 'Google and Facebook certified marketer with proven track record of growing businesses.', '9 years marketing experience, 5 years consulting', 1, true, '2025-01-19 11:00:00+00'),
('6ba7b814-9dad-11d1-80b4-00c04fd430c8', 'CFA charterholder with expertise in portfolio management and financial planning.', '12 years Wall Street experience, 6 years advising', 1, true, '2025-01-20 13:30:00+00'),
('6ba7b815-9dad-11d1-80b4-00c04fd430c8', 'Native speaker with DELE certification and experience teaching all proficiency levels.', '12 years language instruction, fluent in 4 languages', 1, true, '2025-01-21 08:45:00+00'),
('6ba7b816-9dad-11d1-80b4-00c04fd430c8', 'Professional photographer with work featured in National Geographic and Vogue.', '15 years professional photography, 8 years teaching', 1, true, '2025-01-22 15:20:00+00'),
('6ba7b817-9dad-11d1-80b4-00c04fd430c8', 'Master of Music Performance from Juilliard. Concert performer and dedicated educator.', '16 years performing, 10 years teaching', 1, true, '2025-01-23 12:10:00+00'),
('6ba7b818-9dad-11d1-80b4-00c04fd430c8', 'Executive coach with ICF certification. Worked with Fortune 500 leaders.', '15 years corporate leadership, 8 years coaching', 1, true, '2025-01-24 17:00:00+00'),
('6ba7b819-9dad-11d1-80b4-00c04fd430c8', 'Published iOS and Android apps with millions of downloads. Swift and Kotlin expert.', '7 years mobile development, 4 years teaching', 1, true, '2025-01-25 10:15:00+00'),
('6ba7b81a-9dad-11d1-80b4-00c04fd430c8', 'CISSP certified with experience in penetration testing and security architecture.', '11 years cybersecurity, 5 years training', 1, true, '2025-01-26 14:40:00+00'),
('6ba7b81b-9dad-11d1-80b4-00c04fd430c8', 'Licensed therapist specializing in cognitive behavioral therapy and mindfulness.', '9 years clinical practice, 6 years group therapy', 1, true, '2025-01-27 09:25:00+00'),
('6ba7b81c-9dad-11d1-80b4-00c04fd430c8', 'PhD in Physics from MIT. Research focus on quantum mechanics and particle physics.', '14 years research, 10 years university teaching', 1, true, '2025-01-28 16:55:00+00'),
('6ba7b81d-9dad-11d1-80b4-00c04fd430c8', 'Berklee College graduate with expertise in classical, jazz, and contemporary guitar.', '15 years performing, 12 years teaching', 1, true, '2025-01-29 11:35:00+00');

commit;