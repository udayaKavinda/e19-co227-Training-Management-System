// imports
import { useState } from 'react';
import CardToAnnouncement from "../Templates/CardToAnnouncement";
import { TbSend } from "react-icons/tb";
import axios from 'axios';

// main function
const AnnounceForm1 = ({ onSubmit, dropdownCourses, facultyName, deanData, selectedDeanData }) => {

  // useStates
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedNames, setSelectedNames] = useState([]);

  // constants
  const names = facultyName;
  const mailSubject = `Requesting Nominee List for the course: ${selectedCourse}`;
  const mailbody =
    `
    Dear Sir/Madam,
  
    We're gearing up for an upcoming course: ${selectedCourse} and need the nominee list from your department or college. Please share this information by (date)

    Required Details:
        Full Name
        Department of the nominee
        Contact Info: Email and Phone
        Designation
              
    Your prompt response will help us make necessary arrangements for the course.

    Feel free to contact us if you have any questions.

    Thank you for your cooperation.
          
    Best regards,
    Staff Development Center
    `;

  // functions
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    if (e.target.checked) {
      setSelectedNames((prevSelected) => [...prevSelected, name]);
    } else {
      setSelectedNames((prevSelected) =>
        prevSelected.filter((n) => n !== name)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedNames.length === 0) {
      alert("Select Email Recepients");
    } else {
      onSubmit({ selectedCourse, selectedNames });
    }
  };

  const sendMails = () => {
    const postData = selectedDeanData.map(dean => ({
      to: dean.email,
      body: mailbody,
      subject: mailSubject,
    }));

    // console.log(postData)

    axios.post("http://localhost:8080/email/send", postData)
      .then(response => {
        // console.log('POST response:', response.data);
        alert("Mails Sent")
      })

      .catch(error => {
        console.error('POST error:', error);
      });
  };

  // html, css, js all together -> typeScript
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="text-xl block text-gray-700 font-bold mb-2">
          Select a course:
        </label>
        <select
          className="block w-full p-2 border rounded-lg"
          value={selectedCourse}
          onChange={handleCourseChange}
          required
        >
          <option value="" disabled defaultValue>
            Select a course
          </option>
          {dropdownCourses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-xl text-gray-700 font-bold mb-2">Select Faculties:</p>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {deanData.map((name) => (
            <div
              key={name.id}
              className="p-4 bg-gray-800 rounded-md shadow-xl transition-transform transform hover:scale-105"
            >
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-500"
                  value={name.name}
                  onChange={handleNameChange}
                  checked={selectedNames.includes(name.name)}
                />
                <span className="ml-2 font-bold text-white">{name.name}</span>
              </label>
              <CardToAnnouncement key={name.id} deanName={name.deanname} deanMail={name.email} />
            </div>
          ))}
        </div>
      </div>
      <div className="text-left">
        <button
          className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={sendMails}
        >
          <TbSend className="inline mr-2" />
          Send All
        </button>
      </div>
    </form>
  );
};

export default AnnounceForm1;