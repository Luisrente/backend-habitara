const LandlordRequestModel = require('../../../infrastructure/db/sequelize/models/LandlordRequestModel');
const UserModel = require('../../../infrastructure/db/sequelize/models/UserModel');
const UserRole = require('../../../domain/user/enums/UserRole');

class LandlordRequestController {
  async create(req, res) {
    try {
      const {
        propertyTitle,
        propertyType,
        city,
        address,
        description,
        documentsSummary,
        nationalId,
        idDocumentPhoto,
        educationLevel,
        criminalRecordStatus,
        criminalRecordDocument,
        termsAccepted
      } = req.body;

      if (!propertyTitle || !propertyType || !city || !address || !description) {
        throw new Error('Faltan datos requeridos para la solicitud');
      }

      if (!city || !address || !educationLevel) {
        throw new Error('Debes ingresar tu ciudad de residencia, dirección y nivel de estudio');
      }

      if (!nationalId || !idDocumentPhoto) {
        throw new Error('Debes ingresar tu cédula y adjuntar la foto de identidad');
      }

      if (!termsAccepted) {
        throw new Error('Debes aceptar los términos y condiciones');
      }

      const existingRequest = await LandlordRequestModel.findOne({
        where: {
          user_id: req.user.sub,
          status: 'pending'
        }
      });

      if (existingRequest) {
        return res.status(409).json({
          success: false,
          message: 'Ya tienes una solicitud de arrendador pendiente por revisión'
        });
      }

      const request = await LandlordRequestModel.create({
        user_id: req.user.sub,
        property_title: propertyTitle,
        property_type: propertyType,
        city,
        address,
        description,
        documents_summary: documentsSummary || null,
        status: 'pending',
        national_id: nationalId,
        id_document_photo: idDocumentPhoto,
        education_level: educationLevel,
        criminal_record_status: criminalRecordStatus || null,
        criminal_record_document: criminalRecordDocument || null,
        terms_accepted: termsAccepted
      });

      return res.status(201).json({
        success: true,
        data: request,
        message: 'Solicitud enviada correctamente. El administrador la revisará.'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async listForAdmin(req, res) {
    try {
      const requests = await LandlordRequestModel.findAll({
        include: [{
          model: UserModel,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'role', 'status']
        }],
        order: [['createdAt', 'DESC']]
      });

      const payload = requests.map((request) => ({
        id: request.id,
        status: request.status,
        propertyTitle: request.property_title,
        propertyType: request.property_type,
        city: request.city,
        address: request.address,
        description: request.description,
        documentsSummary: request.documents_summary,
        nationalId: request.national_id,
        idDocumentPhoto: request.id_document_photo,
        educationLevel: request.education_level,
        criminalRecordStatus: request.criminal_record_status,
        criminalRecordDocument: request.criminal_record_document,
        termsAccepted: request.terms_accepted,
        adminNote: request.admin_note,
        createdAt: request.createdAt,
        user: request.user ? {
          id: request.user.id,
          firstName: request.user.first_name,
          lastName: request.user.last_name,
          email: request.user.email,
          phone: request.user.phone,
          role: request.user.role,
          status: request.user.status
        } : null
      }));

      return res.status(200).json({
        success: true,
        data: payload
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, adminNote } = req.body;
      const validStatuses = ['pending', 'approved', 'rejected'];

      if (!validStatuses.includes(status)) {
        throw new Error('Estado no válido');
      }

      const request = await LandlordRequestModel.findByPk(id);
      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada'
        });
      }

      await request.update({
        status,
        admin_note: adminNote || null
      });

      if (status === 'approved') {
        await UserModel.update(
          { role: UserRole.LANDLORD, status: 'active' },
          { where: { id: request.user_id } }
        );
      }

      return res.status(200).json({
        success: true,
        data: {
          id: request.id,
          status: request.status
        },
        message: 'Solicitud actualizada correctamente'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async mine(req, res) {
    try {
      const request = await LandlordRequestModel.findOne({
        where: { user_id: req.user.sub },
        order: [['createdAt', 'DESC']]
      });

      if (!request) {
        return res.status(200).json({ success: true, data: null });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: request.id,
          status: request.status,
          adminNote: request.admin_note,
          createdAt: request.createdAt,
          educationLevel: request.education_level,
          city: request.city
        }
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new LandlordRequestController();
