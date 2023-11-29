"use client";
import { FormEvent, useState, useRef, ChangeEvent } from "react";
export default function Home() {
  const [jd, setJd] = useState<string | number | readonly string[] | undefined>(
    ""
  );
  const [file, setFile] = useState<string | ArrayBuffer | null>(null);

  const reportHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("here");
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  };

  return (
    <main className=" h-screen w-screen bg-green-50">
      <div className=" bg-teal-600 p-2 text-center">
        Applicant Tracking System
      </div>
      <div className="flex  text-black ">
        <section className=" basis-1/2 border-r-2 border-r-black p-2">
          <form
            action=""
            className=" flex flex-col gap-2"
            onSubmit={reportHandler}
          >
            <label>Enter Job Description</label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className=" h-80 w-full border-2 border-black outline-none rounded-md p-2"
            ></textarea>
            <label>Upload Resume/CV</label>
            <input type="file" accept=".pdf" onChange={fileChangeHandler} />
            <button
              type="submit"
              className=" bg-rose-600 p-2 text-white rounded-md"
            >
              Get Report
            </button>
          </form>
        </section>
        <section className=" basis-1/2"> section2</section>
      </div>
    </main>
  );
}
