const balanceSheet = (data) => {
  let str = data;
  var splitBalance = str.split(/[\t\s\n]/i)

  var patternMoney = /[0-9.,]/;
  var patternText = /[a-z]/gi;
  var patternTextDiacritics = /[a-z()]/gi;
  // DADOS TRANSACAO
  let transacao= []
  for (i=1; i<splitBalance.length; i++) {
    let answer = patternMoney.test(splitBalance[i]);
    if (answer === true) 
      transacao.push(splitBalance[i])
  }
  // COM DIACRITICS
  let arrayDescription= []
  for (i=1; i<splitBalance.length; i++) {
    let answer = patternText.test(splitBalance[i]);
    if (answer === true) 
      arrayDescription.push(splitBalance[i])
  }
  var description = arrayDescription.join(' ')

  // SEM DIACRITICS
  let arrayDescriptionDiacrits= []
  for (i=1; i<splitBalance.length; i++) {
    let answer = patternTextDiacritics.test(splitBalance[i]);
    if (answer === true) 
      arrayDescriptionDiacrits.push(splitBalance[i])
  }
  var descriptionDiacrits = arrayDescriptionDiacrits.join(' ')
  
  let balancete = {
    companyId: 1,
    classification: splitBalance[0],
    description: description,
    description_nd: descriptionDiacrits,
    initialCash: transacao[0],
    debit: transacao[1],
    credit: transacao[2],
    finalCash: transacao[3],
  }

  return balancete;
}

module.exports = {
  balanceSheet,
}