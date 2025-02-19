const AnimalController = {
    getAll: (req, res) => {
        res.send("Listando todos os animais");
    },
    getById: (req, res) => {
        res.send(`Buscando animal com ID: ${req.params.id}`);
    },
    create: (req, res) => {
        res.send("Criando um novo animal");
    },
    update: (req, res) => {
        res.send(`Atualizando animal com ID: ${req.params.id}`);
    },
    delete: (req, res) => {
        res.send(`Removendo animal com ID: ${req.params.id}`);
    },
};

export default AnimalController;
