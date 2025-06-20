import { useState } from "react";
import { ResultBox } from "../components/ResultBox";

export const MainPage = () => {
  const [med1, setMed1] = useState("");
  const [med2, setMed2] = useState("");
  const [searchMed1, setSearchMed1] = useState("");
  const [searchMed2, setSearchMed2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const response = {
    strong_enhancement: "Усиление действия",
    mild_enhancement: "Слабое усиление действия",
    reduction: "Ослабление действия",
    toxicity_increase: "Усиление токсичности",
    no_data: "Нет информации о взаимодействии",
    incompatible: "Не совместимы",
  }

  const checkInteraction = async () => {
    setError("");
    setResult(null);
    setLoading(true)

    if (!med1 || !med2) {
      setError("Пожалуйста, введите оба названия препаратов.");
      setLoading(false)
      return;
    }


    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/medication?med1=${med1}&med2=${med2}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка при получении данных.");
      } else {
        setSearchMed1(med1);
        setSearchMed2(med2);
        setResult(data);
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
      setError("Ошибка подключения к серверу.");
    }

    // setLoading(false)
  };  

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            Проверка взаимодействия препаратов
          </h2>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Название препарата 1"
              value={med1}
              onChange={(e) => setMed1(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Название препарата 2"
              value={med2}
              onChange={(e) => setMed2(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={checkInteraction} disabled={loading}>
            {loading ? "Загрузка..." : "Проверить взаимодействие"}
          </button>

          {loading && (
            <div className="loader-container mt-4">
              <div className="custom-loader"></div>
              <div className="text-muted mt-2">Анализируем взаимодействие...</div>
            </div>
          )}


          {error && !loading && (
            <div className="alert alert-danger mt-4 text-center" role="alert">
              {error}
            </div>
          )}


          {result && !loading && (
            <ResultBox
              result={result}
              med1={searchMed1}
              med2={searchMed2}
              response={response}
            />
          )}
        </div>
      </div>
    </div>
  );
}
