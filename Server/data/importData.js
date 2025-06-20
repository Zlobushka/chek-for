const XLSX = require("xlsx");
const sequelize = require("../db");
const { Medication, Compatibility } = require("../models/models");

// Маппинг символов в статусы
const SYMBOL_TO_STATUS = {
  "++": "strong_enhancement",
  "+": "mild_enhancement",
  "-": "reduction",
  "*": "toxicity_increase",
  "□": "no_data",
  "н/с": "incompatible",
  "н\\с": "incompatible",
  "н/с.": "incompatible"
};

async function importData() {
  try {
    await sequelize.authenticate();
    console.log("🟢 Подключено к Neon DB");

    // Загружаем таблицу
    const workbook = XLSX.readFile("./data/medication.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headers = data[0].slice(1); // названия по горизонтали
    const medicationMap = {};

    // Загружаем препараты
    for (let name of headers) {
      if (!name) continue;
      const cleanName = name.trim();
      const [med] = await Medication.findOrCreate({ where: { name: cleanName } });
      medicationMap[cleanName] = med.id;
    }

    // Загружаем взаимодействия
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowMedName = row[0]?.trim();
      const rowMedId = medicationMap[rowMedName];

      if (!rowMedId) continue;

      for (let j = 1; j < row.length; j++) {
        const colMedName = headers[j - 1]?.trim();
        const colMedId = medicationMap[colMedName];

        const rawSymbol = String(row[j] || "").trim();
        const status = SYMBOL_TO_STATUS[rawSymbol];

        if (!status || rowMedId >= colMedId) continue;

        // Проверка на дубликаты
        const exists = await Compatibility.findOne({
          where: {
            medication1Id: rowMedId,
            medication2Id: colMedId
          }
        });

        if (!exists) {
          await Compatibility.create({
            medication1Id: rowMedId,
            medication2Id: colMedId,
            status
          });
        }
      }
    }

    console.log("✅ Импорт завершён!");
    process.exit();
  } catch (err) {
    console.error("❌ Ошибка при импорте:", err);
    process.exit(1);
  }
}

importData();
