def notify_client_of_decision(db, appointment, decision):
    client = db.query(Client).filter(Client.id == appointment.client_id).first()
    if not client:
        return
    # Aquí puedes integrar tu servicio de correo o chatbot
    if decision == "accepted":
        subject = "¡Tu cita ha sido aceptada!"
        message = f"Hola {client.name}, tu cita con el artista ha sido aceptada. Nos vemos el {appointment.date}."
    else:
        subject = "Tu cita fue rechazada"
        message = f"Hola {client.name}, lamentamos informarte que tu cita fue rechazada. Por favor intenta con otro horario o artista."
    # Ejemplo: send_email(client.email, subject, message)
    print(f"Notificación enviada a {client.email}: {subject} - {message}")