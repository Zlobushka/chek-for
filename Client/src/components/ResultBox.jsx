import React from "react";

export const ResultBox = React.memo(({ result, med1, med2, response }) => {
    if (!result) return null;
  
    const resultClass =
      result.status === "no_data" || result.status === "incompatible"
        ? "alert alert-danger mt-4 text-center"
        : "alert alert-info mt-4 text-center";
  
    return (
      <div className={resultClass}>
        <h5 className="mb-2">Результат взаимодействия:</h5>
        <p>
          <strong>{med1}</strong> + <strong>{med2}</strong>
        </p>
        <p>
          <strong>Тип:</strong> {response[result.status]}
        </p>
        {result.comment && (
          <p>
            <strong>Комментарий:</strong> {result.comment}
          </p>
        )}
      </div>
    );
  }
);
  