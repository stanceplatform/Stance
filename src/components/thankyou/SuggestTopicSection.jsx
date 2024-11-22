import * as React from "react";
import { useState } from "react";

function SuggestTopicSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [topicSuggestion, setTopicSuggestion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This will be implemented in operations file
    // await submitTopicSuggestion(topicSuggestion);
    setTopicSuggestion("");
    setIsFormOpen(false);
  };

  return (
    <section className="flex flex-col mt-52 w-full text-base max-w-[358px]">
      <p className="leading-6 text-center text-lime-800">
        Have a new topic to share idea?<br />
        Let us know!
      </p>
      <button 
        className="gap-2 self-center px-4 py-2 mt-4 text-yellow-200 bg-purple-700 rounded-[40px]"
        aria-label="Suggest a new topic"
        onClick={() => setIsFormOpen(true)}
      >
        Suggest a Topic
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">Suggest a Topic</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                rows="4"
                value={topicSuggestion}
                onChange={(e) => setTopicSuggestion(e.target.value)}
                placeholder="Enter your topic suggestion..."
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default SuggestTopicSection;