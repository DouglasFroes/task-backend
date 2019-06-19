const moment = require('moment');

module.exports = app =>{
    const getTasks = (req, res) =>{
        const date = req.query.date ? req.query.date 
            : moment().endOf('day').toDate();

        app.db('tasks')
            .where({userId: req.user.id})
            .where('estimateAt', '<=', date)
            .orderBy('estimateAt')
            .then(task => res.json(task))
            .catch(err=>res.stutus(500).json(err));
    };

    const add = (req, res) => {
        if(!req.body.desc.trim()){
            return res.status(400).send('descrição obrigatoria');
        }

        req.body.userId = req.user.id;

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(501).json(err));
    };
    

    const remove = (req, res)=>{
        app.db('tasks').where({
            id: req.params.id,
            userId: req.user.id
        }).del()
          .then(rowsDeleted =>{
              if(rowsDeleted >0){
                  res.status(204).send('apagado');
              }else{
                res.status(503).send(`Nao foi possivel apagar id: ${req.params.id}`);
              }
          }).catch(err=>res.status(400).json(err));
    };

    const updateTaskDoneAt = (req, res, doneAt)=>{
        app.db('tasks').where({
            id: req.params.id,
            userId: req.user.id
        }).update({ doneAt })
        .then(_=>res.status(200).send('atualizado'))
        .catch(err=>res.status(401).json(err));
    };

    const toggleTask = (req, res)=>{
        app.db('tasks')
        .where({ id: req.params.id, userId: req.user.id})
        .first()
          .then(task=>{
              if(!task){
                  const msg = `task com id: ${req.params.id}`;
                  return res.status(402).send(msg);
              }

              const doneAt = task.doneAte ? null : new Date();
              updateTaskDoneAt(req, res, doneAt);  
          }).catch(err => res.status(403).json(err));
    };

    return { getTasks, add, remove, toggleTask};
}