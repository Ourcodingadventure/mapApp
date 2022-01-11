/** @format */

export default function MarkerWithDetails({ point, onToggle }) {
  const { coordinates, title, description, showDetails } = point;

  return (
    <TouchableOpacity onPress={onToggle}>
      <Marker coordinate={{ latitude: lat, longitude: long }} />
      {showDetails && <Details title={title} description={description} />}
    </TouchableOpacity>
  );
}
