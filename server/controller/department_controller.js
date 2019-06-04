var express = require('express');
var router = express.Router();
var Department = require('./../Schemas/department');

router.post('/', function (req, res) {
    console.log(req.body);
    let d = new Department({
        name: req.body.name
    })
    d.save((err, dep) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(dep);
        }
    })
});

router.get('/', function (req, res) {
    Department.find().exec((err, deps) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(deps);
        }
    })
});

router.delete('/:id', function (req, res) {
    let id = req.params.id;
    Department.deleteOne({ _id: id }, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send({});
        }
    })
});

router.patch('/:id', function (req, res) {
    let id = req.params.id;
    Department.findById(id, (err, dep) => {
        if (err) {
            res.status(500).send(err);
        } else if (!dep) {
            res.status(404).send({});
        } else {
            dep.name = req.body.name;
            dep.save()
                .then((dep) => res.status(200).send(dep))
                .catch((e) => res.status(500).send(e))
        }
    })
});

module.exports = router