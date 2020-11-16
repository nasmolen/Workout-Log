const express = require('express');
const router = express.Router();
const {Log} = require('../models');
const validateSession = require('../middleware/validateSession');

router.get("/log", (req, res) => {
    Log.findAll()
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({
            error: err
        }))
})

router.post('/log', validateSession, async (req, res) => {
    try {
        
        const {description, definition, result, owner_id} = req.body;

        let newLog = await Log.create({
            description, definition, result, owner_id
        });
        res.status(200).json({
            log: newLog,
            message: "Log Created!"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Log Creation Failed."
        })
    }
})

router.get('/:id', (req, res) => {
    Log.findOne({ where: { id: req.params.id }})
    .then(log => res.status(200).json(log))
    .catch(err => res.status(500).json({ error: err}))
})

//* PUT then GET
router.put("/:id", (req, res) => {
    
    const query = req.params.id;
    
    Log.update(req.body, { where: { id: query } })
        
      .then((logsUpdated) => {
          
        Log.findOne({ where: { id: query } })
            
        .then((locatedUpdatedLog) => {
            
          res.status(200).json({
            log: locatedUpdatedLog,
            message: "Log updated successful",
            logsChanged: logsUpdated,
          });
        });
      })
      
      .catch((err) => res.json(err));
});

router.delete('/:id', (req, res) => {
    Log.destroy({
        where: {id: req.params.id}
    })
    .then(log => res.status(200).json(log))
    .catch(err => res.json({error: err}))   // OR json(err)
})

module.exports = router;