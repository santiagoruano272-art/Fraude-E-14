/**
 * Determina si un formulario E-14 tiene fraude electoral.
 * El fraude ocurre cuando la suma de todos los votos supera
 * la capacidad máxima registrada de votantes en esa mesa.
 *
 * @param {Object} form 
 * @returns {boolean} 
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
