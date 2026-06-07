// ══════════════════════════════════════════════════════════════
//  E-14 FORENSIC ENGINE — Lógica de auditoría electoral
//  Usa module.exports (CommonJS) para compatibilidad con Jest
// ══════════════════════════════════════════════════════════════

/**
 * Determina si un formulario E-14 tiene fraude electoral.
 * El fraude ocurre cuando la suma de todos los votos supera
 * la capacidad máxima registrada de votantes en esa mesa.
 *
 * @param {Object} form - Formulario E-14 con votos y datos de mesa
 * @returns {boolean} true si hay fraude, false si está verificado
 */
const checkTableFraud = (form) => {
  const totalVotes =
    form.candidate_a_votes +
    form.candidate_b_votes +
    form.blank_votes +
    form.null_votes;

  const maxCapacity = form.polling_tables?.registered_voters || 0;

  return totalVotes > maxCapacity;
};

module.exports = { checkTableFraud };
