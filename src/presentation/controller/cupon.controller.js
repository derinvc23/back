class CuponController {
    constructor(cuponService) {
        this.cuponService = cuponService;
    }

    getAll = async (req, res) => {
        const cupons = await this.cuponService.getAllCupons();
        res.status(200).json(cupons);
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const cupon = await this.cuponService.getCuponById(id);
        res.status(200).json(cupon);
    }

    getByCode = async (req, res) => {
        const { code } = req.params;
        const cupon = await this.cuponService.getCuponByCode(code);
        res.status(200).json(cupon);
    }

    create = async (req, res) => {
        const cupon = await this.cuponService.createCupon(req.body);
        res.status(201).json(cupon);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const cupon = await this.cuponService.updateCupon(id, req.body);
        res.status(200).json(cupon);
    }

    delete = async (req, res) => {
        const { id } = req.params;
        await this.cuponService.deleteCupon(id);
        res.status(204).send();
    }

    validate = async (req, res) => {
        const { code } = req.params;
        const result = await this.cuponService.validateCupon(code);
        res.status(200).json(result);
    }

    apply = async (req, res) => {
        const { code } = req.params;
        const result = await this.cuponService.applyCupon(code);
        res.status(200).json(result);
    }
}

module.exports = CuponController;
