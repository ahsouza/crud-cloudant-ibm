// import módulos
const IBMCloudEnv = require('ibm-cloud-env')
IBMCloudEnv.init('/server/config/mappings.json')
// Configurando Cloudant
const CloudantSDK = require('@cloudant/cloudant');
const cloudant = new CloudantSDK(IBMCloudEnv.getString('cloudant_url'))

// NEW DATABASE 'balancete' caso ele ainda não existe
cloudant.db.create('balancete')
  .then(data => {
    console.log('Banco de Dados "balancete" criado com sucesso!')
  })
  .catch(error => {
    if (error.error === 'file_exists') {
      console.log('Banco de Dados "balancete" já existe!')
    } else {
      console.log('Ocorreu um erro ao criar Banco De Dados "balancete"', error.error)
    }
  })


const balancete = cloudant.db.use('balancete');

// READ balancetes from database
exports.getBalancetes = (req, res, next) => {
  console.log('In route - getBalancetes')

  return balancete.list({include_docs: true})
    .then(fetchedBalancete => {
      let balancetes = [];
      let row = 0;
      fetchedBalancete.rows.forEach(fetchedBalancete => {
        balancetes[row] = {
          _id: fetchedBalancete.id,
          companyId: fetchedBalancete.doc.companyId,
          balanceSheet: fetchedBalancete.doc.balanceSheet,
          date: fetchedBalancete.doc.date,
          timestamp: fetchedName.doc.timestamp,
        };
        row = row + 1;
      });
      console.log('Balancetes recebido com sucesso!')
      return res.status(200).json(balancetes)
    })
    .catch(error => {
      console.log('Falha ao receber balancetes')
      return res.status(500).json({
        message: 'Falha ao tentar pegar balancete.',
        error: error,
      })
    })
}

// CREATE balancetes to database
exports.addBalancete = (req, res, next) => {
  console.log('In route - addBalancete');
  let balancete = {
    companyId: req.body.companyId,
    balanceSheet: req.body.balanceSheet,
    date: req.body.date,
    timestamp: req.body.timestamp,
  };
  return balancete.insert(balancete)
    .then(addedBalancete => {
      console.log('Balancete adicionado com sucesso!');
      return res.status(201).json({
        _id: addedBalancete.id,
        companyId: addedBalancete.companyId,
        balanceSheet: addedBalancete.balanceSheet,
        date: addedBalancete.date,
        timestamp: addedBalancete.timestamp,
      });
    })
    .catch(error => {
      console.log('Falha ao tentar registrar balancete');
      return res.status(500).json({
        message: 'Falha ao tentar salvar balancete.',
        error: error,
      });
    });
};

// UPDATE balancetes to database
exports.addBalancete = (req, res, next) => {
  console.log('In route - updateBalancete');

  let modified_balancete = {
    _id: req.body.id,
    companyId: req.body.companyId,
    balanceSheet: req.body.balanceSheet,
  }

  return balancete.update(modified_balancete)
    .then(()=>{
      console.log('Balancete atualizado com sucesso!');
      return res.status(201).json({ message: 'Balancete atualizado com sucesso!'});
    })
    .catch(error => {
      console.log('Falha ao tentar atualizar balancete');
      return res.status(500).json({
        message: 'Falha ao tentar atualizar balancete.',
        error: error,
      });
    });
};
