import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import { PdfReader } from "pdfreader";
import pdfjs from "pdfjs-dist";
import OpenAI from "openai";
import test from "./test.json";
import { RiArrowDropDownLine, RiDeleteBin7Fill } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import axios from "axios";

let count = 0;

const ai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const response: string = `{
  "mistakes": [
    "The resume is missing a summary or objective statement at the beginning.",
    "The resume does not mention proficiency in Next.js or Vue.js, which are required in the job description.",
    "The resume does not mention experience with website performance testing using Google page speed insights.",
    "The resume does not mention experience with browser testing using Selenium and BrowserStack.",
    "The resume does not provide any information about the candidate's interpersonal skills."
  ],
  "score": 75,
  "compatibility": "The resume shows significant alignment with the job description. The candidate has demonstrated proficiency in relevant programming languages and technologies, such as HTML, CSS, JavaScript, React.js, and Node.js. The candidate also has experience with software development and internships, showcasing their ability to work in teams and develop features to enhance user experience. Additionally, the candidate's projects demonstrate their practical skills in front-end development and data structures. However, there are some important skills and experiences missing from the resume, such as proficiency in Next.js or Vue.js, experience with website performance testing using Google page speed insights, experience with browser testing using Selenium and BrowserStack, and information about the candidate's interpersonal skills.",
  "recommendations": "To enhance the resume, the candidate should include a summary or objective statement at the beginning to provide a concise overview of their skills, experiences, and career goals. Additionally, the candidate should update their skills section to include proficiency in Next.js or Vue.js, and add information about their experience with website performance testing using Google page speed insights and browser testing using Selenium and BrowserStack. It would also be beneficial for the candidate to highlight their interpersonal skills, such as communication and teamwork, to align with the job description's emphasis on collaboration. Providing specific examples of projects or experiences that demonstrate these skills would further strengthen the resume.",
  "sample": "sa;dfk;jsssssssssssssssssssssssssssssssssssssssssss;ljkfowiefjwoeiwjfwwwwwwwwwweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeewwwwwwwwwwwwwfeiowelkfjjwlkjiojjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjowieowievlka ;aslkdjv   ssssslllllljjjjjjjjjjjjjjjjjjjjjjjjjj\\nlskdsffff"
}
`;

const Prompt: string = `You are an experienced resume reviewer and hiring manager with over 20 years of expertise in the software engineering hiring field. Your responsibility is to evaluate the content of a resume in comparison to a given job description. You will receive two texts: the 'Job Description' and the 'Resume Content.' Your task is to scrutinize the resume and assess the relevance of skills, projects, experiences, achievements, and education based on the job description's requirements. Following your analysis, you should generate a JSON result in the specified format:

{
  'mistakes': String[],
  'score': Number,
  'compatibility': String,
  'recommendations': String,
  'sample': String
}

Here's what each part of the JSON should include:

1. 'mistakes': This array should contain up to 5 strings identifying any mistakes in the resume. If no mistakes are found, the array should state: 'The resume is free from major errors. Please avoid including less significant or unrelated mistakes.'

2. 'score': An integer between 80 and 100, reflecting the resume's compatibility with the job description in terms of skills, projects, experiences, achievements, and education.

3. 'compatibility': A text containing a maximum of 200 words. In this section, your task is to emphasize what has been done correctly and how well the resume aligns with the job description.

4. 'recommendations': Another text with a maximum of 200 words. Here, you should offer suggestions for enhancing the resume to increase the candidate's chances of securing the job.

5. 'sample': In this part, you should provide a sample resume that integrates corrections for identified mistakes and applies appropriate improvements. Ensure that you do not introduce unrelated, false, or hypothetical content in the sample resume.

Please avoid including extraneous information that goes beyond the specified requirements. Refrain from using the word candidate or it's synonyms in the JSON text.`;

interface DataType {
  mistakes: string[];
  score: number;
  compatibility: string;
  recommendations: string;
  sample: string;
}

function App() {
  const param = useParams();
  const email = param.email;
  const [jd, setJd] = useState<string | number | readonly string[] | undefined>(
    `About the job
We are looking for programmers with a keen eye for design for the position of front-end developer. Front-end developers are responsible for ensuring the alignment of web design and user experience requirements, optimizing web pages for maximum efficiency, and maintaining brand consistency across all web pages, among other duties.

Front-end developers are required to work in teams alongside back-end developers, graphic designers, and user experience designers to ensure all elements of web creation are consistent. This requires excellent communication and interpersonal skills.

The duration of the Token Metrics internship program is 3 months. It is an evaluative unpaid internship with the possibility of return offers, depending on the company's needs.

Responsibilities

Ensure all webpages are compatible in all browsers 
Determining the structure and design of web pages
Ensuring user experience determines design choices
Developing features to enhance the user experience
Striking a balance between functional and aesthetic design
Ensuring web design is optimized for smartphones
Building reusable code for future use
Optimizing web pages for maximum speed and scalability


Requirements

Proficiency in Html, Css, Javascript, React
Next.js, or Vue.js
Website performance testing (Google page speed insights)
Browser testing, Selenium and BrowserStack 
Degree in computer science or related field
Understanding of server-side CSS
Experience with responsive and adaptive design
Good problem-solving skills
Good interpersonal skills


About Token Metrics

Token Metrics helps crypto investors build profitable portfolios using artificial intelligence based crypto indices, rankings, and price predictions.

Token Metrics has a diverse set of customers, from retail investors and traders to crypto fund managers, in more than 50 countries.
`
  );

  const [cv, setCv] = useState<string | number | readonly string[] | undefined>(
    `RAHUL KUMAR PANDEY
CSE Undergraduate, New Delhi, India
| Email: rahulkrpandey.2001@gmail.com | Phone: +91 888 242 1996 | LinkedIn:linkedin.com/in/rahulkrpandey2001 |
    | LeetCode: leetcode.com/coderpi/ |

EDUCATION
➢ Guru Gobind Singh Indraprastha University (USICT), New Delhi, India		   	     2020 - 2024
Bachelor of Technology, Computer Science and Engineering
➢DGPA: 9.00

SKILLS

➢ C | C++ | C# | Java | TypeScript | Python | JavaScript | HTML | CSS | React.js | Tailwind CSS | Chakra UI | Express.js | Node.js | MongoDB | Relational Database | MySQL| PostgreSQL | REST API | LINUX | Git | GitHub | Data Structures and Algorithms | Operating Systems | Object Oriented Programming | Database Management System | Software Engineering | Problem Solving | Self-learning | Abstract Thinking | Ambiguous or Undefined Problem Solving.

WORK EXPERIENCE
➢ Software Development Engineer Intern | Hike               	                   	  April 2023 - September 2023
• Enhanced developer productivity by 40% through the creation of a C# and Unity tool for analysing game states in logs.
• Devised an algorithm to efficiently parse over 10,000 lines of CSV data into a string matrix for log analysis tool.
• Conducted a thorough analytical assessment to identify root causes of user-reported issues, contributing to 5-10% improvement in game quality.
• Achieved a 20% reduction in game asset bundle size through the removal of unused assets and efficient sprite atlassing. 
➢ Research Intern | Utkrisht, Summer Internship Program              	     	        July 2022 - August 2022
• Designed and developed a fullstack, responsive e-commerce website named "Shoptronics," showcasing hands-on application of cutting-edge web development concepts (Certificate).
•  Utilised React.js and Tailwind CSS to craft the dynamic front-end (Link), enhancing user experience with a seamless and adaptable interface.
• Empowered the website’s functionality by architecting the back-end (Link) using Express.js, Node.js, and MongoDB, ensuring robust data management and efficient operations.

PROJECTS
➢ Creative.ly: Online Drawing Application (React.js, Typescript, Tailwind CSS) | Link
• Developed an online drawing application utilising the browser's Canvas API.
• Implemented a wide range of features, including colouring, erasing, a laser pen, undo/redo functionality, and navigation between pages.
• Introduced a user-friendly sticky notes feature, enhancing functionality through drag-and-drop capabilities.
➢ CodeCanvas Simulation: Data Structures Simulator (React.js, Chakra UI, D3) | Link
• Engineered a web application that facilitates real-time interaction and simulation of tree data structures.
• Implemented fundamental operations for data structures such as binary search trees and min heaps, including insertion, deletion, and standard traversals. 
• Developed real-time visualisation of a Minimum Spanning Tree (MST) using Kruskal’s algorithm.
➢ TriviaTrek: Platform to Challenge Coding Skills (Java, Spring, Spring Boot, PostgreSQL) | Link
• Crafted RESTful APIs using Java, Spring, Spring Boot, and PostgreSQL for the 'TriviaTrek' project, enabling efficient assessment of coding skills through MCQ tests. 
• Enforced security using Spring Security and JWT, ensuring user data and API protection.
➢ Bomberman 3D: Unity Based 3D Game For Android Platform (Unity, C#) | Link
• Designed and developed an engaging 3D game, "Bomberman 3D," using Unity and C#.
• Implemented game mechanics, such as dynamic object interactions, player controls, and AI behaviour.`
  );

  const [file, setFile] = useState<string | ArrayBuffer | null>(null);
  const [data, setData] = useState<DataType | null>(null);
  const [show, setShow] = useState<boolean>(true);

  const aiCall = async (jd: String, cv: String) => {
    const completion = await ai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: `
          ${Prompt}

          =======================================

          Job Description: 
          ${jd} 
          
          Resume Content:
          ${cv}`,
        },
      ],
      model: "gpt-3.5-turbo",
      // model: "gpt-4-0613",
    });

    return completion.choices[0].message.content;
  };

  const reportHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!jd || !cv) return;
    console.log("processing...");
    const message = await aiCall(jd.toString(), cv.toString());
    // const message = response;

    try {
      if (!message) throw new DOMException("response is null");
      const res = JSON.parse(message);
      console.log(res);
      setData(res);
    } catch (e) {
      setData(null);
      console.log("error occured", e);
    }
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
    // console.log(e.target.files[0]);
  };

  return (
    <main className=" h-screen w-screen ">
      <nav className=" bg-teal-900  px-8 flex justify-between text-white">
        <span
          onClick={(e) => setShow(true)}
          className=" my-auto hover:cursor-pointer"
        >
          Applicant Tracking System
        </span>
        <div className="flex items-center justify-between gap-2">
          <span>{email ? email : "useremail"}</span>
          <button
            onClick={(e) => setShow(false)}
            className=" hover:bg-red-900 self-stretch py-2 px-2"
          >
            Applied Jobs
          </button>
          <button className=" hover:bg-red-900 self-stretch py-2 px-2">
            Logout
          </button>
        </div>
      </nav>
      {!show && <List email={email} />}
      {show && (
        <div className="flex  text-black ">
          <section className=" basis-1/2 border-r-2 border-r-black p-2">
            <form
              action=""
              className=" flex flex-col gap-2"
              onSubmit={reportHandler}
            >
              <label className="text-white">Enter Job Description</label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className=" h-64 w-full border-2 border-black outline-none rounded-md p-2"
              ></textarea>
              <label className="text-white">Enter Resume/CV</label>
              <textarea
                value={cv}
                onChange={(e) => setCv(e.target.value)}
                className=" h-64 w-full border-2 border-black outline-none rounded-md p-2"
              ></textarea>
              {/* <label>Upload Resume/CV</label> */}
              {/* <input type="file" accept=".pdf" onChange={fileChangeHandler} /> */}
              <button
                type="submit"
                className=" bg-rose-600 p-2 text-white rounded-md"
              >
                Get Report
              </button>
            </form>
          </section>
          <section
            className=" basis-1/2 p-2 overflow-y-scroll text-white "
            style={{
              height: "calc(100vh - 50px)",
              // height: '500px',
              overflowY: "scroll",
            }}
          >
            <h1 className=" text-center text-2xl font-bold m-2">Report</h1>
            {data && (
              <div className=" max-w-3xl">
                <h2 className=" text-lg font-semibold italic underline">
                  Mistakes in resume
                </h2>
                <ul className=" list-disc px-4">
                  {data.mistakes.map((item) => (
                    <li key={count++}>{item}</li>
                  ))}
                </ul>

                <h2 className=" text-lg font-semibold italic underline m-2">
                  Resume score
                </h2>
                <p>Your resume score is: {Math.max(+data.score, 80)}</p>

                <h2 className=" text-lg font-semibold italic underline m-2">
                  Compatibility of resume
                </h2>
                <p>{data.compatibility}</p>

                <h2 className=" text-lg font-semibold italic underline m-2">
                  Recommendations on resume
                </h2>
                <p>{data.compatibility}</p>

                <h2 className=" text-lg font-semibold italic underline mb-2">
                  Sample Resume
                </h2>
                <textarea
                  className=" border-2 border-black p-2 w-full h-64 text-black"
                  defaultValue={data.sample}
                  readOnly={true}
                ></textarea>
              </div>
            )}
            {!data && (
              <div className=" flex items-center justify-center h-full">
                <span className=" text-4xl italic font-light">
                  Report will be displayed here
                </span>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

interface JobType {
  company: string;
  id: string;
  description: string;
  date: string;
  expand: boolean;
}
const List: React.FC<{ email: string | undefined }> = ({ email }) => {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const editRef = useRef<boolean>(false);
  const [formVal, setFormVal] = useState<JobType>({
    company: "",
    id: "",
    description: "",
    date: "",
    expand: false,
  });

  const expandHandler = (item: JobType) => {
    setJobs((jobs) =>
      jobs.map((job) => {
        if (job.id === item.id) {
          const newJob: JobType = {
            ...job,
            expand: !job.expand,
          };

          return newJob;
        }
        return job;
      })
    );
  };

  const deleteHandler = async (item: JobType) => {
    try {
      const BASE_URL = process.env.REACT_APP_BASE_URL;
      const TOKEN = localStorage.getItem("TOKEN");
      const res = await axios.post(
        `${BASE_URL}/jobs/${item.id}`,
        {
          data: {},
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      console.log(res);
      setJobs((jobs) =>
        jobs.filter((job) => {
          return job.id !== item.id;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("TOKEN");
    console.log(TOKEN);
    try {
      e.preventDefault();
      if (formVal.id.length === 0) {
        const id = uuid();
        const res = await axios.post(
          `${BASE_URL}/jobs`,
          {
            data: {
              job: {
                id,
                jobTitle: formVal.company,
                date: formVal.date,
                description: formVal.description,
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        console.log(res);
        setJobs((jobs) => [
          ...jobs,
          {
            ...formVal,
            id,
          },
        ]);
      } else {
        const res = await axios.put(
          `${BASE_URL}/jobs`,
          {
            data: {
              job: {
                id: formVal.id,
                jobTitle: formVal.company,
                date: formVal.date,
                description: formVal.description,
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        console.log(res);
        setJobs((jobs) =>
          jobs.map((job) => {
            if (job.id === formVal.id) {
              return formVal;
            } else {
              return job;
            }
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: JobType
  ) => {
    e.stopPropagation();
    console.log("here", item);
    editRef.current = true;
    setFormVal({ ...item });
  };

  useEffect(() => {
    if (editRef.current) {
      editRef.current = false;
      return;
    }

    setFormVal({
      id: "",
      company: "",
      date: "",
      description: "",
      expand: false,
    });
  }, [jobs, setJobs]);

  useEffect(() => {
    console.log(formVal);
  }, [formVal]);

  useEffect(() => {
    const initialise = async () => {
      try {
        const BASE_URL = process.env.REACT_APP_BASE_URL;
        const TOKEN = localStorage.getItem("TOKEN");
        const res = await axios.get(`${BASE_URL}/jobs/${email}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        const data = res.data as {
          id: string;
          jobTitle: string;
          description: string;
          date: string;
        }[];

        setJobs(
          data.map((item) => {
            return {
              id: item.id,
              company: item.jobTitle,
              description: item.description,
              date: item.date,
              expand: false,
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    };

    initialise();
  }, []);

  return (
    <div>
      <form
        action=""
        onSubmit={submitHandler}
        className=" flex gap-2 border-2 border-black rounded-md w-4/5 mx-auto bg-teal-900 text-white p-2 mt-4"
      >
        <div className=" flex flex-col gap-2 basis-1/3 p-2">
          <label>
            <span className=" text-red-300">*</span> Company Name
          </label>
          <input
            required
            className="outline-none border-2 border-black rounded-md  text-black p-2"
            type="text"
            value={formVal.company}
            onChange={(e) =>
              setFormVal((form) => {
                return {
                  ...form,
                  company: e.target.value,
                };
              })
            }
          />
          <label>Date</label>
          <input
            className=" outline-none border-2 border-black rounded-md text-black p-2"
            type="text"
            value={formVal.date}
            onChange={(e) =>
              setFormVal((form) => {
                return {
                  ...form,
                  date: e.target.value,
                };
              })
            }
          />
        </div>
        <div className=" basis-2/3 flex flex-col gap-2 p-2">
          <label>Description</label>
          <textarea
            value={formVal.description}
            onChange={(e) =>
              setFormVal((form) => {
                return {
                  ...form,
                  description: e.target.value,
                };
              })
            }
            className=" h-full p-2 outline-none border-2 border-black rounded-md text-black"
          />
          <button type="submit" className="px-4 py-2 bg-rose-500 rounded-md ">
            SAVE
          </button>
        </div>
      </form>
      <div
        style={{ maxHeight: "calc(100vh - 300px)" }}
        className=" overflow-x-hidden overflow-y-scroll w-4/5 mx-auto rounded-md border-2 border-black mt-4"
      >
        {jobs.map((item, idx) => (
          <div
            key={item.id}
            className={`flex flex-col pt-2 ${
              !item.expand || item.description.length === 0 ? "pb-2" : ""
            } ${
              idx % 2 ? "bg-teal-900" : "bg-teal-700"
            } text-white hover:cursor-pointer `}
            onClick={(e) => expandHandler(item)}
          >
            <div className=" flex justify-between">
              {/* <div className=""> */}
              <span className=" flex gap-4 items-center">
                <RiArrowDropDownLine
                  size={"2em"}
                  className={`${item.expand && " rotate-180"}`}
                />
                <span className=" uppercase text-2xl italic font-semibold ">
                  {item.company}
                </span>
                <RxDividerVertical size={"3em"} />
                <span className=" my-auto">{item.date}</span>
              </span>
              <span className=" flex gap-6 items-center">
                <button
                  onClick={(e) => deleteHandler(item)}
                  className=" self-stretch px-2 hover:bg-red-900"
                >
                  <RiDeleteBin7Fill color="#fdba74" size={"1.5em"} />
                </button>
                <button
                  onClick={(e) => editHandler(e, item)}
                  className=" self-stretch px-2 hover:bg-red-900"
                >
                  <MdEdit color="#fdba74" size={"1.5em"} />
                </button>
              </span>
            </div>
            {item.expand && (
              <p className=" text-md bg-gray-100 text-black px-4">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
/*
 * Mistakes in resume
 * top 5 mistakes made in resume
 * Compatibility of resume with respect to jd
 * Resume score on the basis of overall structure, content, relevency of job description, correctness, skills
 * Some recommendations on improvement on the resume on the basis of jd
 */

/*

"You are a resume reviewer and hiring manager with over 20 years of experience in the respective domains. Your job is to assess the content of a resume in comparison to the provided job description. You will receive two texts: the 'Job Description' and the 'Resume Content.' Your task is to analyze the resume and evaluate the relevance of skills, projects, experiences, achievements, and education based on the job description's requirements. After the analysis, you should generate a JSON result in the following format:

```json
{
  "mistakes": String[],
  "score": Number,
  "compatibility": String,
  "recommendations": String,
  "sample": String
}
```

Here's what each part of the JSON should contain:

1. "mistakes": This should be an array of strings and can contain a maximum of 5 mistakes made by the candidate in the resume. If the candidate did not make any mistakes, the array should have the string: "Your resume is error-free. Please "

2. "score": An integer between 0 and 100 representing the resume's compatibility with the job description in terms of skills, projects, experiences, achievements, and education.

3. "compatibility": A text with a maximum of 200 words. In this section, you need to highlight what the candidate has done correctly and how well their resume aligns with the job description.

4. "recommendations": Another text with a maximum of 200 words. Here, you should provide suggestions on how the candidate can improve their resume to enhance their chances of securing the job.

5. "sample": In this part, you should provide a sample resume that incorporates corrections for any identified mistakes and makes appropriate changes. Ensure that you do not include unrelated, false, or hypothetical content in the sample resume.

Please refrain from adding irrelevant information beyond the provided requirements."
*/

/* Test Prompt
You are a resume reviewer and hiring manager with over 20 years of experience in the software engineering hiring domains. Your job is to assess the content of a resume in comparison to the provided job description. You will receive two texts: the 'Job Description' and the 'Resume Content.' Your task is to analyze the resume and evaluate the relevance of skills, projects, experiences, achievements, and education based on the job description's requirements. After the analysis, you should generate a JSON result in the following format:

```json
{
  "mistakes": String[],
  "score": Number,
  "compatibility": String,
  "recommendations": String,
  "sample": String
}
```

Here's what each part of the JSON should contain:

1. "mistakes": This should be an array of strings and can contain a maximum of 5 mistakes made by the candidate in the resume. If the candidate did not make any mistakes, the array should have the string: "Your resume is free from major errors. Please refrain from adding less important or irrelevant mistakes"

2. "score": An integer between 0 and 100 representing the resume's compatibility with the job description in terms of skills, projects, experiences, achievements, and education.

3. "compatibility": A text with a maximum of 200 words. In this section, you need to highlight what the candidate has done correctly and how well their resume aligns with the job description.

4. "recommendations": Another text with a maximum of 200 words. Here, you should provide suggestions on how the candidate can improve their resume to enhance their chances of securing the job.

5. "sample": In this part, you should provide a sample resume that incorporates corrections for any identified mistakes and makes appropriate changes. Ensure that you do not include unrelated, false, or hypothetical content in the sample resume.

Please refrain from adding irrelevant information beyond the provided requirements. Do not use word candidate in any of the text in JSON

"Job Description:
About the job
We are looking for programmers with a keen eye for design for the position of front-end developer. Front-end developers are responsible for ensuring the alignment of web design and user experience requirements, optimizing web pages for maximum efficiency, and maintaining brand consistency across all web pages, among other duties.

Front-end developers are required to work in teams alongside back-end developers, graphic designers, and user experience designers to ensure all elements of web creation are consistent. This requires excellent communication and interpersonal skills.

The duration of the Token Metrics internship program is 3 months. It is an evaluative unpaid internship with the possibility of return offers, depending on the company's needs.

Responsibilities

Ensure all webpages are compatible in all browsers 
Determining the structure and design of web pages
Ensuring user experience determines design choices
Developing features to enhance the user experience
Striking a balance between functional and aesthetic design
Ensuring web design is optimized for smartphones
Building reusable code for future use
Optimizing web pages for maximum speed and scalability


Requirements

Proficiency in Html, Css, Javascript, React
Next.js, or Vue.js
Website performance testing (Google page speed insights)
Browser testing, Selenium and BrowserStack 
Degree in computer science or related field
Understanding of server-side CSS
Experience with responsive and adaptive design
Good problem-solving skills
Good interpersonal skills


About Token Metrics

Token Metrics helps crypto investors build profitable portfolios using artificial intelligence based crypto indices, rankings, and price predictions.

Token Metrics has a diverse set of customers, from retail investors and traders to crypto fund managers, in more than 50 countries.

Resume Content:
RAHUL KUMAR PANDEY
CSE Undergraduate, New Delhi, India
| Email: rahulkrpandey.2001@gmail.com | Phone: +91 888 242 1996 | LinkedIn:linkedin.com/in/rahulkrpandey2001 |
    | LeetCode: leetcode.com/coderpi/ |

EDUCATION
➢ Guru Gobind Singh Indraprastha University (USICT), New Delhi, India		   	     2020 - 2024
Bachelor of Technology, Computer Science and Engineering
➢DGPA: 9.00

SKILLS

➢ C | C++ | C# | Java | TypeScript | Python | JavaScript | HTML | CSS | React.js | Tailwind CSS | Chakra UI | Express.js | Node.js | MongoDB | Relational Database | MySQL| PostgreSQL | REST API | LINUX | Git | GitHub | Data Structures and Algorithms | Operating Systems | Object Oriented Programming | Database Management System | Software Engineering | Problem Solving | Self-learning | Abstract Thinking | Ambiguous or Undefined Problem Solving.

WORK EXPERIENCE
➢ Software Development Engineer Intern | Hike               	                   	  April 2023 - September 2023
• Enhanced developer productivity by 40% through the creation of a C# and Unity tool for analysing game states in logs.
• Devised an algorithm to efficiently parse over 10,000 lines of CSV data into a string matrix for log analysis tool.
• Conducted a thorough analytical assessment to identify root causes of user-reported issues, contributing to 5-10% improvement in game quality.
• Achieved a 20% reduction in game asset bundle size through the removal of unused assets and efficient sprite atlassing. 
➢ Research Intern | Utkrisht, Summer Internship Program              	     	        July 2022 - August 2022
• Designed and developed a fullstack, responsive e-commerce website named "Shoptronics," showcasing hands-on application of cutting-edge web development concepts (Certificate).
•  Utilised React.js and Tailwind CSS to craft the dynamic front-end (Link), enhancing user experience with a seamless and adaptable interface.
• Empowered the website’s functionality by architecting the back-end (Link) using Express.js, Node.js, and MongoDB, ensuring robust data management and efficient operations.

PROJECTS
➢ Creative.ly: Online Drawing Application (React.js, Typescript, Tailwind CSS) | Link
• Developed an online drawing application utilising the browser's Canvas API.
• Implemented a wide range of features, including colouring, erasing, a laser pen, undo/redo functionality, and navigation between pages.
• Introduced a user-friendly sticky notes feature, enhancing functionality through drag-and-drop capabilities.
➢ CodeCanvas Simulation: Data Structures Simulator (React.js, Chakra UI, D3) | Link
• Engineered a web application that facilitates real-time interaction and simulation of tree data structures.
• Implemented fundamental operations for data structures such as binary search trees and min heaps, including insertion, deletion, and standard traversals. 
• Developed real-time visualisation of a Minimum Spanning Tree (MST) using Kruskal’s algorithm.
➢ TriviaTrek: Platform to Challenge Coding Skills (Java, Spring, Spring Boot, PostgreSQL) | Link
• Crafted RESTful APIs using Java, Spring, Spring Boot, and PostgreSQL for the 'TriviaTrek' project, enabling efficient assessment of coding skills through MCQ tests. 
• Enforced security using Spring Security and JWT, ensuring user data and API protection.
➢ Bomberman 3D: Unity Based 3D Game For Android Platform (Unity, C#) | Link
• Designed and developed an engaging 3D game, "Bomberman 3D," using Unity and C#.
• Implemented game mechanics, such as dynamic object interactions, player controls, and AI behaviour.
"

*/
