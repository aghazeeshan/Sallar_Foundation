-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2025 at 09:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `charity_foundation`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','moderator') DEFAULT 'moderator',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `email`, `password`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'admin_dev', 'admin@sallarfoundation.org', '$2a$10$sr/MbhFRTvTtOlANQgkoVOWS8K2JYn8t/NNKaq4KL5kWGlbqZYZCG', 'admin', 1, '2025-10-13 21:44:32', '2025-10-14 22:50:05');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `sub_heading` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) NOT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `button_link` varchar(500) DEFAULT NULL,
  `text_alignment` enum('left','center','right') DEFAULT 'center',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `sub_heading`, `description`, `image_url`, `button_text`, `button_link`, `text_alignment`, `is_active`, `created_at`, `updated_at`, `display_order`) VALUES
(11, 'Building Hope, One Life at a Time', 'Join Our Mission', 'Together, we break the cycles of poverty and despair by educating children, building safe homes for the vulnerable, providing critical aid during floods, empowering women to achieve economic independence, and delivering essential medical care through free camps.', '/uploads/banner_1760492179193_7dc930f4-3174-4d64-9f6c-0bd7bd5da082.jpg', 'Donate Now', 'http://localhost:3000/donate', 'left', 1, '2025-10-15 01:36:19', '2025-10-15 01:36:26', 0),
(12, 'Sponsor a Child\'s Education', 'Children\'s Education', 'We believe every child deserves the chance to learn and thrive. Our education initiative unlocks potential by creating quality learning environments, providing essential supplies like books and uniforms, and supporting nutritional and emotional well-being to ensure that poverty is not a barrier to a child\'s dreams and a brighter future.', '/uploads/banner_1760500881915_6715184089_49cdaf1c32_b.jpg', 'Donate For Education', 'http://localhost:3000/donate', 'left', 1, '2025-10-15 04:01:22', '2025-10-15 04:10:18', 0),
(13, 'Shelter & Housing', 'Fund a Home', 'We restore dignity and security by building safe, durable homes for families without shelter and reconstructing communities devastated by natural disasters. We provide more than just four walls; we provide a stable foundation from which families can rebuild their lives, seek opportunities, and foster growth away from vulnerability and fear.', '/uploads/banner_1760501062739_Pakistan.jpg', 'Donate For Home', 'http://localhost:3000/donate', 'left', 1, '2025-10-15 04:04:22', '2025-10-15 04:04:27', 0),
(14, 'Flood & Disaster Relief', 'Flood & Disaster Relief', 'Acting as a vital lifeline in times of crisis, our emergency response teams provide immediate relief during floods by distributing clean water, food, and temporary shelter, while our long-term commitment focuses on helping communities recover, rebuild, and regain their self-sufficiency after the disaster has passed.', '/uploads/banner_1760501150901_image1170x530cropped.jpg', 'Donate For Flood', 'http://localhost:3000/donate', 'left', 1, '2025-10-15 04:05:50', '2025-10-15 04:05:54', 0),
(15, 'Empower a Woman Today', 'Women\'s Empowerment', 'We are dedicated to fostering women\'s empowerment by providing vocational training, resources, and support systems for those unable to work outside the home, enabling them to develop skills, generate sustainable income, and gain financial independence, thereby transforming their own lives and the futures of their families.', '/uploads/banner_1760501263807_1659335-image-1520973770.jpg', 'Donate For Women\'s', 'http://localhost:3000/donate', 'left', 1, '2025-10-15 04:07:43', '2025-10-15 04:07:47', 0),
(16, 'Support a Medical Camp', 'Medical Aid', 'Understanding that health is a fundamental human right, our medical aid program operates free health camps in underserved communities, offering critical consultations, treatments, and medications to those who need it most, ensuring that lack of funds never stands between an individual and their well-being.', '/uploads/banner_1760501334562_ph_56962_223380.jpg', 'Donate For Medical', 'http://localhost:3000/donate', 'left', 1, '2025-10-15 04:08:54', '2025-10-15 04:08:57', 0);

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `content`, `excerpt`, `featured_image`, `author_id`, `status`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to Our Foundation', 'welcome-to-our-foundation', 'This is our first blog post. We are excited to share our journey with you.', 'Welcome message from our foundation', NULL, 1, 'published', '2025-10-14 22:03:49', '2025-10-14 22:03:49', '2025-10-14 22:03:49');

-- --------------------------------------------------------

--
-- Table structure for table `blog_post_categories`
--

CREATE TABLE `blog_post_categories` (
  `post_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `created_at`) VALUES
(1, 'Health', 'health', 'Health-related blog posts and articles', '2025-10-14 22:01:52'),
(2, 'Education', 'education', 'Educational content and resources', '2025-10-14 22:01:52'),
(3, 'Community', 'community', 'Community development and outreach', '2025-10-14 22:01:52'),
(4, 'Events', 'events', 'Upcoming events and activities', '2025-10-14 22:01:52');

-- --------------------------------------------------------

--
-- Table structure for table `contact_forms`
--

CREATE TABLE `contact_forms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','closed') DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_forms`
--

INSERT INTO `contact_forms` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Sarah Johnson', 'sarah@email.com', '+1234567890', 'Volunteer Inquiry', 'I would like to volunteer for your charity organization. Please let me know how I can help.', 'new', '2025-10-13 21:05:56', '2025-10-13 21:05:56'),
(2, 'Michael Brown', 'michael@email.com', '+1987654321', 'Donation Question', 'I want to make a large donation. Can you provide me with more information about your programs?', 'read', '2025-10-13 21:05:56', '2025-10-13 21:05:56'),
(3, 'Emily Davis', 'emily@email.com', '+1555123456', 'Partnership Opportunity', 'Our company is interested in partnering with your foundation. Please contact us to discuss.', 'new', '2025-10-13 21:05:56', '2025-10-13 21:05:56'),
(4, 'David Wilson', 'david@email.com', '+447123456789', 'Event Information', 'I would like to know about upcoming events and how to participate.', 'replied', '2025-10-13 21:05:56', '2025-10-13 21:05:56'),
(5, 'Lisa Garcia', 'lisa@email.com', '+34612345678', 'General Inquiry', 'Thank you for the great work you are doing. I have some questions about your services.', 'new', '2025-10-13 21:05:56', '2025-10-13 21:05:56'),
(6, 'Test User', 'test@email.com', '+1234567890', 'Test Subject', 'This is a test message from the contact form.', 'new', '2025-10-13 21:09:24', '2025-10-13 21:09:24'),
(7, 'Zeeshan Khan', 'zeeshan107526@gmail.com', '03062398377', 'contact details', 'dasfd', 'new', '2025-10-13 21:10:36', '2025-10-13 21:10:36'),
(8, 'Zeeshan Khan', 'zeeshan107526@gmail.com', '03062398377', 'contact details', 'testing', 'new', '2025-10-15 07:03:56', '2025-10-15 07:03:56');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','archived') DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `replied_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `id` int(11) NOT NULL,
  `donor_name` varchar(255) NOT NULL,
  `donor_email` varchar(255) NOT NULL,
  `donor_phone` varchar(20) DEFAULT NULL,
  `donor_country` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'USD',
  `payment_method` varchar(50) DEFAULT NULL,
  `donation_type` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_anonymous` tinyint(1) DEFAULT 0,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donations`
--

INSERT INTO `donations` (`id`, `donor_name`, `donor_email`, `donor_phone`, `donor_country`, `amount`, `currency`, `payment_method`, `donation_type`, `message`, `is_anonymous`, `status`, `transaction_id`, `created_at`, `updated_at`) VALUES
(1, 'John Smith', 'john@email.com', '+1234567890', 'United States', 100.00, 'USD', 'Credit Card', 'General Donation', 'Thank you for your great work!', 0, 'completed', NULL, '2025-10-13 20:50:58', '2025-10-13 20:50:58'),
(2, 'Sarah Johnson', 'sarah@email.com', '+1987654321', 'Canada', 250.00, 'USD', 'PayPal', 'Education Fund', 'Supporting education for children', 0, 'completed', NULL, '2025-10-13 20:50:58', '2025-10-13 20:50:58'),
(3, 'Ahmed Hassan', 'ahmed@email.com', '+923001234567', 'Pakistan', 500.00, 'USD', 'Bank Transfer', 'Medical Camp', 'Helping with medical expenses', 0, 'completed', NULL, '2025-10-13 20:50:58', '2025-10-13 20:50:58'),
(4, 'Maria Garcia', 'maria@email.com', '+34612345678', 'Spain', 75.00, 'USD', 'Credit Card', 'Food Program', 'Feeding the hungry', 0, 'completed', NULL, '2025-10-13 20:50:58', '2025-10-13 20:50:58'),
(5, 'David Wilson', 'david@email.com', '+447123456789', 'United Kingdom', 300.00, 'USD', 'PayPal', 'Emergency Relief', 'Emergency assistance fund', 0, 'completed', NULL, '2025-10-13 20:50:58', '2025-10-13 20:50:58'),
(6, 'Zeeshan Khan', 'zeeshan107526@gmail.com', '03062398377', '', 10.00, 'USD', 'Credit Card', 'general', '', 0, 'completed', 'TXN_1760389172193_3io9zux28', '2025-10-13 20:59:32', '2025-10-13 20:59:32');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `event_date` date NOT NULL,
  `event_time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `registration_required` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_registrations`
--

CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_images`
--

CREATE TABLE `gallery_images` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery_images`
--

INSERT INTO `gallery_images` (`id`, `title`, `description`, `image_url`, `category`, `is_featured`, `display_order`, `created_at`) VALUES
(1, '', '', '/uploads/gallery/gallery_1760506059555_148197175.jpg', 'general', 0, 0, '2025-10-15 05:27:39'),
(2, '', '', '/uploads/gallery/gallery_1760506673498_330227113.webp', 'general', 0, 0, '2025-10-15 05:37:53'),
(3, '', '', '/uploads/gallery/gallery_1760506690946_950556368.jpg', 'general', 0, 0, '2025-10-15 05:38:11'),
(4, '', '', '/uploads/gallery/gallery_1760506706042_621678975.jpg', 'general', 0, 0, '2025-10-15 05:38:26'),
(5, '', '', '/uploads/gallery/gallery_1760511404093_116728526.jpg', 'general', 0, 0, '2025-10-15 06:56:44'),
(6, '', '', '/uploads/gallery/gallery_1760511419077_184472940.jpg', 'general', 0, 0, '2025-10-15 06:56:59');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) NOT NULL,
  `icon_class` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `description`, `image_url`, `icon_class`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Medical Camp', 'Every month we organize a medical camp in rural areas in order to meet people and provide them free medication.', '/images/img10.jpg', 'fa-utensils', 1, 1, '2025-10-13 20:25:28', '2025-10-13 20:40:19'),
(2, 'Employment Opportunity', 'We provide the employment like Buying a Rickshaw for monthly income We buy an auto rickshaw and lease it to drivers or use it for a transport business.', '/images/img6.jpg', 'fa-graduation-cap', 1, 2, '2025-10-13 20:25:28', '2025-10-13 20:25:28'),
(3, 'Sewing Machines', 'Providing sewing machines to women who can work from home on stitching, tailoring, embroidery, or making garments.', '/images/img7.jpg', 'fa-medkit', 1, 3, '2025-10-13 20:25:28', '2025-10-13 20:25:28'),
(5, 'Education Support', 'We provide educational resources, scholarships, and learning materials to help children access quality education.', '/images/img6.jpg', 'fa-graduation-cap', 1, 2, '2025-10-14 11:09:19', '2025-10-14 11:09:19'),
(6, 'Employment Opportunities', 'Creating job opportunities by providing rickshaws, sewing machines, and other tools for income generation.', '/images/img7.jpg', 'fa-briefcase', 1, 3, '2025-10-14 11:09:19', '2025-10-14 11:09:19'),
(7, 'Food Distribution', 'Regular food distribution programs to ensure no one goes hungry in our community.', '/images/img8.jpg', 'fa-utensils', 1, 4, '2025-10-14 11:09:19', '2025-10-14 11:09:19'),
(8, 'Emergency Relief', 'Quick response team for natural disasters and emergency situations to provide immediate assistance.', '/images/img9.jpg', 'fa-hands-helping', 1, 5, '2025-10-14 11:09:19', '2025-10-14 11:09:19'),
(9, 'Flood & Disaster Relief', 'Acting as a vital lifeline in times of crisis, our emergency response teams provide immediate relief during floods by distributing clean water, food, and temporary shelter, while our long-term commitment focuses on helping communities recover, rebuild, and regain their self-sufficiency after the disaster has passed.', '/uploads/services/service_1760514067192_232596418.jpg', '', 1, 1, '2025-10-15 07:41:07', '2025-10-15 07:42:24');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `setting_type` varchar(50) NOT NULL,
  `setting_value` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `setting_type`, `setting_value`, `created_at`, `updated_at`) VALUES
(1, 'theme', '{\"primaryColor\":\"#012a23\",\"secondaryColor\":\"#eb9801\",\"textDark\":\"#333333\",\"textLight\":\"#666666\"}', '2025-10-15 04:38:16', '2025-10-15 04:38:16'),
(2, 'logo', '{\"headerLogo\":\"/images/sallar_logo.png\",\"stickyLogo\":\"/images/sticky_logo.png\",\"footerLogo\":\"/images/sticky_logo.png\",\"favicon\":\"/favicon.ico\"}', '2025-10-15 04:38:16', '2025-10-15 04:38:16'),
(3, 'email', '{\"adminEmail\":\"info@sallarfoundation.org\",\"smtpHost\":\"smtp.hostinger.com\",\"smtpPort\":\"587\",\"smtpUser\":\"info@sallarfoundation.org\",\"smtpPassword\":\"InfoAdmin123!@#\",\"sendDonationEmail\":true,\"sendContactEmail\":true,\"sendVolunteerEmail\":true}', '2025-10-15 04:38:16', '2025-10-15 07:03:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','moderator') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@charityfoundation.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1, '2025-10-14 22:01:52', '2025-10-14 22:01:52');

-- --------------------------------------------------------

--
-- Table structure for table `volunteers`
--

CREATE TABLE `volunteers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `availability` varchar(100) DEFAULT NULL,
  `motivation` text DEFAULT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `emergency_phone` varchar(20) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `volunteers`
--

INSERT INTO `volunteers` (`id`, `name`, `email`, `phone`, `age`, `address`, `skills`, `experience`, `availability`, `motivation`, `emergency_contact`, `emergency_phone`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Sarah Johnson', 'sarah@email.com', '+1234567890', 28, '123 Main St, New York', 'Teaching, Communication', '2 years teaching experience', 'Weekends', 'I want to help children in need', 'John Johnson', '+1234567891', 'pending', '2025-10-13 21:24:10', '2025-10-13 21:24:10'),
(2, 'Michael Brown', 'michael@email.com', '+1987654321', 35, '456 Oak Ave, California', 'Medical, First Aid', '5 years medical experience', 'Evenings', 'Passionate about healthcare', 'Jane Brown', '+1987654322', 'approved', '2025-10-13 21:24:10', '2025-10-13 21:24:10'),
(3, 'Emily Davis', 'emily@email.com', '+1555123456', 24, '789 Pine St, Texas', 'Administration, Organization', '1 year admin experience', 'Weekdays', 'Want to make a difference', 'Robert Davis', '+1555123457', 'pending', '2025-10-13 21:24:10', '2025-10-13 21:24:10'),
(4, 'David Wilson', 'david@email.com', '+447123456789', 42, '321 Elm St, London', 'Construction, Manual Work', '10 years construction', 'Flexible', 'Helping build communities', 'Mary Wilson', '+447123456790', 'approved', '2025-10-13 21:24:10', '2025-10-13 21:24:10'),
(5, 'Lisa Garcia', 'lisa@email.com', '+34612345678', 31, '654 Maple Dr, Madrid', 'Cooking, Nutrition', '3 years culinary', 'Weekends', 'Feeding the hungry', 'Carlos Garcia', '+34612345679', 'pending', '2025-10-13 21:24:10', '2025-10-13 21:24:10'),
(6, 'Test Volunteer', 'test@volunteer.com', '+1234567890', 25, 'Test Address', 'Teaching', '2 years teaching', 'Weekends', 'Want to help', 'Emergency Person', '+1234567891', 'pending', '2025-10-13 21:30:00', '2025-10-13 21:30:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `blog_post_categories`
--
ALTER TABLE `blog_post_categories`
  ADD PRIMARY KEY (`post_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `contact_forms`
--
ALTER TABLE `contact_forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_type` (`setting_type`),
  ADD KEY `idx_setting_type` (`setting_type`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `volunteers`
--
ALTER TABLE `volunteers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_forms`
--
ALTER TABLE `contact_forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `volunteers`
--
ALTER TABLE `volunteers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `blog_post_categories`
--
ALTER TABLE `blog_post_categories`
  ADD CONSTRAINT `blog_post_categories_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blog_post_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
