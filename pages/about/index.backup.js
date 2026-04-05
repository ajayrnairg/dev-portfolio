// import { motion } from "framer-motion";
// import { useState } from "react";
// import { fadeIn } from "../../variants";

// import {
//   FaCss3,
//   FaJava,
//   FaJs,
//   FaNodeJs,
//   FaPhp,
//   FaPython,
//   FaReact
// } from "react-icons/fa";
// import {
//   SiMicrosoftazure,
//   SiMicrosoftsqlserver,
//   SiMongodb,
//   SiMysql,
//   SiNextdotjs,
//   SiRabbitmq,
//   SiSpringboot
// } from "react-icons/si";

// import CountUp from "react-countup";
// import Avatar from "../../components/Avatar";
// import Circles from "../../components/Circles";

// //  data
// export const aboutData = [
//   {
//     title: "skills",
//     info: [
//       {
//         title: "Frontend & UI",
//         icons: [
//           { icon: FaJs, title: "JavaScript" },
//           { icon: FaReact, title: "React" },
//           { icon: SiNextdotjs, title: "Next.js" },
//           { icon: FaCss3, title: "CSS3" },
//         ],
//       },
//       {
//         title: "Backend & APIs",
//         icons: [
//           { icon: FaJava, title: "Java" },
//           { icon: SiSpringboot, title: "Spring Boot" },
//           { icon: FaPython, title: "Python" },
//           { icon: FaNodeJs, title: "Node.js" },
//           { icon: FaPhp, title: "PHP" },
//         ],
//       },
//       {
//         title: "Data & Cloud",
//         icons: [
//           { icon: SiMicrosoftsqlserver, title: "Microsoft SQL Server" },
//           { icon: SiMysql, title: "MySQL" },
//           { icon: SiMongodb, title: "MongoDB" },
//           { icon: SiRabbitmq, title: "RabbitMQ" },
//           { icon: SiMicrosoftazure, title: "Microsoft Azure" },
//         ],
//       },
//     ],
//   },
//   {
//     title: "awards",
//     info: [
//       {
//         title: "Microsoft AI for Earth Grant ($15,000 USD)",
//         stage: "2021 - 2022",
//         description:
//           "Awarded for an AI-based statistical analysis project on land-use plastic pollution.",
//       },
//       {
//         title: "Deep Blue Hackathon Winner - 1st Place",
//         stage: "2023",
//         description: "Created a minutes of meeting generator inside MS Teams.",
//       },
//     ],
//   },
//   {
//     title: "experience",
//     info: [
//       {
//         title: "Full Stack Software Developer | ISS-STOXX",
//         stage: "July 2023 - Present",
//         description:
//           "Engineered the modernization of legacy Spring Boot and React architectures for enterprise climate applications. Optimized data ingestion pipelines for large-scale Parquet datasets, improving processing efficiency by 40%, and architected complex financial calculation engines.",
//       },
//     ],
//   },
//   {
//     title: "certifications",
//     info: [
//       {
//         title: "B.E. Computer Engineering",
//         stage: "University of Mumbai",
//         description:
//           " Secured a First Class with Distinction, graduating in 2023 with a CGPA of 9.7/10.0, demonstrating consistent academic excellence and a strong foundation in computer engineering principles.",
//       },
//       {
//         title: "Machine Learning Specialization",
//         stage: "Coursera (Andrew Ng)",
//         description:
//           " Covered supervised learning, unsupervised learning, and best practices in machine learning. Gained hands-on experience with algorithms like linear regression, logistic regression, neural networks, and support vector machines.",
//       },
//       {
//         title: "Python for Everybody",
//         stage: "Coursera (University of Michigan)",
//         description:
//           " Comprehensive introduction to Python programming, covering basics to advanced topics. Developed skills in data structures, web scraping, and working with databases using Python.",
//       },
//     ],
//   },
// ];

// const About = () => {
//   const [index, setIndex] = useState(0);

//   return (
//     <div className="h-full bg-primary/30 py-32 text-center xl:text-left overflow-visible">
//       <Circles />
//       {/* avatar img */}
//       <motion.div
//         variants={fadeIn("right", 0.2)}
//         initial="hidden"
//         animate="show"
//         // exit="hidden"
//         transition={{ duration: 1, ease: "easeInOut" }}
//         className="hidden xl:flex absolute bottom-12 left-[-120px] -ml-[110px] !scale-[1.5]"
//       >
//         <Avatar />
//       </motion.div>
//       <div className="container mx-auto h-full flex flex-col items-center xl:flex-row gap-x-6">
//         {/* text */}
//         <div className="flex-1 flex flex-col justify-start pt-12 xl:pt-24">
//           <motion.h2
//             variants={fadeIn("right", 0.2)}
//             initial="hidden"
//             animate="show"
//             className="h2 mt-12 xl:mt-0"
//           >
//             <span className="text-accent">Robust architecture</span> drives
//             scalable systems.
//           </motion.h2>

//           <motion.p
//             variants={fadeIn("right", 0.4)}
//             initial="hidden"
//             animate="show"
//             // exit="hidden"
//             className="max-w-[500px] mx-auto xl:mx-0 mb-6 xl:mb-12 px-2 xl:px-0 font-medium"
//           >
//             Over the past 2.5+ years, my focus has been on engineering
//             enterprise-grade solutions. At ISS-STOXX, I specialize in
//             modernizing legacy architectures, optimizing high-volume data
//             pipelines, and building seamless React interfaces for complex
//             financial applications. I thrive at the intersection of backend
//             stability and frontend performance, consistently delivering code
//             that reduces technical debt and scales effortlessly.
//           </motion.p>
//           {/* counters */}
//           <motion.div
//             variants={fadeIn("right", 0.6)}
//             initial="hidden"
//             animate="show"
//             // exit="hidden"
//             className="md:max-w-xl xl:max-w-none mx-auto xl:mx-0 mb-8"
//           >
//             <div className="flex flex-1 xl:gap-x-6">
//               {/* experience */}
//               <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0">
//                 <div className="text-2xl xl:text-4xl font-extrabold text-accent mb-2">
//                   <CountUp
//                     decimal={"."}
//                     decimals={1}
//                     start={0}
//                     end={2.5}
//                     duration={5}
//                   />{" "}
//                   +
//                 </div>
//                 <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
//                   Years of experience
//                 </div>
//               </div>
//               {/* projects */}
//               <div className="relative flex-1 after:w-[1px] after:h-full after:bg-white/10 after:absolute after:top-0 after:right-0">
//                 <div className="text-2xl xl:text-4xl font-extrabold text-accent mb-2">
//                   <CountUp start={0} end={10} duration={5} /> +
//                 </div>
//                 <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
//                   Projects
//                 </div>
//               </div>
//               {/* awards */}
//               <div className="relative flex-1">
//                 <div className="text-2xl xl:text-4xl font-extrabold text-accent mb-2">
//                   <CountUp start={0} end={40} duration={5} suffix="%" /> +
//                 </div>
//                 <div className="text-xs uppercase tracking-[1px] leading-[1.4] max-w-[100px]">
//                   Tech Debt Reduced
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//         {/* info */}
//         <motion.div
//           variants={fadeIn("left", 0.4)}
//           initial="hidden"
//           animate="show"
//           // exit="hidden"
//           className="flex flex-col w-full xl:max-w-[48%] h-[480px]"
//         >
//           <div className="flex gap-x-4 xl:gap-x-8 mx-auto xl:mx-0 mb-4">
//             {aboutData.map((item, itemIndex) => {
//               return (
//                 <div
//                   key={itemIndex}
//                   className={`${
//                     index === itemIndex &&
//                     "text-accent after:w-[100%] after:transition-all after:duration-300"
//                   } cursor-pointer capitalize xl:text-lg relative after:w-8 after:h-[2px] after:bg-white after:absolute after:-bottom-1 after:left-0`}
//                   onClick={() => setIndex(itemIndex)}
//                 >
//                   {item.title}
//                 </div>
//               );
//             })}
//           </div>
//           <div className="py-2 xl:py-6 flex flex-col gap-y-6 items-center xl:items-start">
//             {aboutData[index].info.map((item, itemIndex) => {
//               return (
//                 <div
//                   key={itemIndex}
//                   /* Changed to flex-col and removed md:flex-row */
//                   className="flex flex-col gap-y-2 text-white/60 w-full"
//                 >
//                   {/* Title: Now on its own line */}
//                   <div className="font-bold text-white text-lg">
//                     {item.title}
//                   </div>

//                   {/* Stage/Year */}
//                   {item.stage && (
//                     <div className="text-accent font-medium">{item.stage}</div>
//                   )}

//                   {/* Description: Now sits directly underneath */}
//                   <div className="max-w-[600px] leading-normal">
//                     {item.description}
//                   </div>

//                   {/* Icons */}
//                   <div className="flex gap-x-4 mt-2">
//                     {item.icons?.map?.((iconObj, iconIndex) => {
//                       let Icon = iconObj.icon;
//                       return (
//                         <div
//                           className="text-2xl text-white"
//                           key={iconIndex}
//                           title={iconObj.title}
//                         >
//                           <Icon />
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default About;
