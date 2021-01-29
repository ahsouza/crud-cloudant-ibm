// import módulos
const functions = require('./../helpers/formatColsInRow');
const IBMCloudEnv = require('ibm-cloud-env')
IBMCloudEnv.init('/server/config/mappings.json')
// Configurando Cloudant
const CloudantSDK = require('@cloudant/cloudant');
const cloudant = new CloudantSDK(IBMCloudEnv.getString('cloudant_url'))

// NEW DATABASE 'balancete' caso ele ainda não existe
cloudant.db.create('balancete')
  .then(async data => {
    console.log('Banco de Dados "balancete" criado com sucesso!')
  })
  .catch(async error => {
    if (error.error === 'file_exists') {
      var x = await functions.balanceSheet('41203 (-) IMPOSTOS SOBRE VENDAS E SERVIÇOS  107,31 D  2382,6  0 2.489,91 D'); 
      console.log(x)
      console.log('Banco de Dados "balancete" já existe!')
    } else {
      console.log('Ocorreu um erro ao criar Banco De Dados "balancete"', error.error)
    }
  })


const balancete = cloudant.db.use('balancete');

// NEW balancete
exports.newBalancete = async(req, res, next) => {  
  console.log('In route - newBalancete');
  console.log(req.headers.string);
  let balanceteData = await functions.balanceSheet(req.headers.string);
  // console.log(balanceteData);
  return balancete.insert(balanceteData)
    .then(dataBalancete => {
      console.log('Balancete adicionado com sucesso!');
      console.log(dataBalancete)
      res.send(dataBalancete);

    })
    .catch(error => {
      console.log('Falha ao tentar registrar balancete');
      return res.status(500).json({
        message: 'Falha ao tentar salvar balancete.',
        error: error,
      })
    });
};

// READ balancetes from database -OK
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
          classification: fetchedBalancete.doc.classification,
          description: fetchedBalancete.doc.description,
          description_nd: fetchedBalancete.doc.description_nd,
          initialCash: fetchedBalancete.doc.initialCash,
          debit: fetchedBalancete.doc.debit,
          credit: fetchedBalancete.doc.credit,
          finalCash: fetchedBalancete.doc.finalCash,
        };
        row = row + 1;
      });
      console.log('Balancetes recebido com sucesso!')
      console.log(balancetes)
      return res.status(200).json(balancetes)
    })
    .catch(error => {
      console.log('Falha ao receber balancetes')
      return res.status(500).json({
        message: 'Falha ao tentar pegar balancete.',
        error: error,
      })
    });
};

// UPDATE balancetes to database
exports.updateBalancete = (req, res, next) => {
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

// DELETE balancete to database
exports.deleteBalancete = (req, res, next, balancete) => {
  console.log('In route - deleteBalancete')
  let idBalancete = { _id: req.headers.id };
  console.log(req.body.id);
  return balancete.delete(idBalancete)
    .then(()=>{
      console.log('Balancete deletado com sucesso!')
      return res.status(201).json({ message: 'Balancete deletado com sucesso!'})
    })
    .catch(error => {
      console.log('Falha ao tentar remover balancete')
      return res.status(500).json({
        message: 'Falha ao tentar remover balancete.',
        error: error,
      })
    });
};
