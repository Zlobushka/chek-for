const { Medication, Compatibility } = require("../models/models");

class MedicationController {
    async getMedication(req, res) {
        const { med1, med2 } = req.query;

  if (!med1 || !med2) {
    return res.status(400).json({ error: "Укажите параметры med1 и med2" });
  }

  try {
    const [m1, m2] = await Promise.all([
      Medication.findOne({ where: { name: med1.trim() } }),
      Medication.findOne({ where: { name: med2.trim() } })
    ]);

    if (!m1 || !m2) {
      return res.status(404).json({ error: "Один из препаратов не найден" });
    }

    const [id1, id2] = m1.id < m2.id ? [m1.id, m2.id] : [m2.id, m1.id];

    const interaction = await Compatibility.findOne({
      where: {
        medication1Id: id1,
        medication2Id: id2
      }
    });

    if (!interaction) {
      return res.json({ status: "no_data", message: "Нет информации о взаимодействии" });
    }

    return res.json({
      med1: m1.name,
      med2: m2.name,
      status: interaction.status,
      comment: interaction.comment || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}
}

module.exports = new MedicationController()