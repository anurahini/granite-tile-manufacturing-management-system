import { WhatsAppMessage, VoiceMail, CommunicationNotification } from '../models/models.js';

export const whatsappController = {
  getAll: async (req, res) => {
    try {
      const messages = await WhatsAppMessage.findAll({ order: [['id', 'ASC']] });
      res.json({ success: true, count: messages.length, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { contactName, contactPhone, messageText, sender, attachmentName, attachmentSize } = req.body;
      const msg = await WhatsAppMessage.create({
        contactName: contactName || 'Customer',
        contactPhone: contactPhone || '+91 98765 43210',
        messageText: messageText || '',
        sender: sender || 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachmentName: attachmentName || null,
        attachmentSize: attachmentSize || null,
        status: 'delivered'
      });
      res.status(201).json({ success: true, message: 'Message sent successfully', data: msg });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  sendReal: async (req, res) => {
    try {
      const { contactName, contactPhone, messageText } = req.body;
      const rawPhone = String(contactPhone || '').replace(/[^\d]/g, '');
      const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageText || '')}`;

      const msg = await WhatsAppMessage.create({
        contactName: contactName || 'My Personal Number',
        contactPhone: contactPhone || cleanPhone,
        messageText: messageText || '',
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent_to_real_whatsapp'
      });

      res.json({
        success: true,
        message: 'Real WhatsApp URL created',
        whatsappUrl: waUrl,
        data: msg
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const voicemailController = {
  getAll: async (req, res) => {
    try {
      const mails = await VoiceMail.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: mails.length, data: mails });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { customerName, customerPhone, subject, duration, transcription, notes } = req.body;
      const mail = await VoiceMail.create({
        customerName: customerName || 'Sri Lakshmi Builders',
        customerPhone: customerPhone || '+91 93765 43210',
        subject: subject || 'Voice Message Enquiry',
        timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        duration: duration || '00:28',
        transcription: transcription || 'Voice mail recording from customer site.',
        notes: notes || '',
        status: 'New'
      });
      res.status(201).json({ success: true, message: 'Voice message recorded', data: mail });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  updateNote: async (req, res) => {
    try {
      const mail = await VoiceMail.findByPk(req.params.id);
      if (!mail) return res.status(404).json({ success: false, message: 'Voice mail not found' });
      mail.notes = req.body.notes || mail.notes;
      await mail.save();
      res.json({ success: true, message: 'Note updated successfully', data: mail });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

export const notificationController = {
  getAll: async (req, res) => {
    try {
      const notifs = await CommunicationNotification.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: notifs.length, data: notifs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { title, message, type } = req.body;
      const notif = await CommunicationNotification.create({
        title, message, type: type || 'System',
        timestamp: new Date().toISOString()
      });
      res.status(201).json({ success: true, message: 'Notification created', data: notif });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  markRead: async (req, res) => {
    try {
      const notif = await CommunicationNotification.findByPk(req.params.id);
      if (notif) {
        notif.isRead = true;
        await notif.save();
      }
      res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};
