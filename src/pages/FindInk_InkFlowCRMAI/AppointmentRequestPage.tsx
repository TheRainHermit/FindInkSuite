import AppointmentRequestForm from "./AppointmentRequestForm";

const AppointmentRequestPage = () => {
  // Puedes obtener el artistId de un selector o prop, aquí lo dejamos fijo como ejemplo
  const artistId = 2;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Solicitar Cita</h2>
      <AppointmentRequestForm artistId={artistId} />
    </div>
  );
};

export default AppointmentRequestPage;