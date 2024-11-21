import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("once"); // once, daily, weekly, monthly
  const [loading, setLoading] = useState(false);

  const convertToCron = () => {
    const dateObj = new Date(`${date}T${time}`);
    const minutes = dateObj.getMinutes();
    const hours = dateObj.getHours();
    const dayOfMonth = dateObj.getDate();
    const month = dateObj.getMonth() + 1;

    switch (frequency) {
      case "once":
        return `${minutes} ${hours} ${dayOfMonth} ${month} ? *`;
      case "daily":
        return `${minutes} ${hours} * * ? *`;
      case "weekly":
        return `${minutes} ${hours} ? * ${dateObj.getDay()} *`;
      case "monthly":
        return `${minutes} ${hours} ${dayOfMonth} * ? *`;
      default:
        return `${minutes} ${hours} ${dayOfMonth} ${month} ? *`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cronExpression = convertToCron();
      const response = await axios.post(
        "https:// /reservation",
        { topic, time: cronExpression },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("예약이 성공적으로 생성되었습니다!");
      setTopic("");
      setDate("");
      setTime("");
    } catch (error) {
      console.error(error);
      alert("예약 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            예약 시스템
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            회의 예약을 위한 정보를 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700"
              >
                회의 주제
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="예: 주간 팀 미팅"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  날짜
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  시간
                </label>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="frequency"
                className="block text-sm font-medium text-gray-700"
              >
                알림 주기
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="once">1회성</option>
                <option value="daily">매일</option>
                <option value="weekly">매주</option>
                <option value="monthly">매월</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "처리중..." : "예약 생성"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
