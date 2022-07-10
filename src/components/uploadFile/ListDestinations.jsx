const ListDistinations = ({
  selectionDestination,
  selectionGroup,
  data,
  dataGroup,
}) => {
  return (
    <>
      <div className="destiontionAndGroupList">
        {selectionDestination.length > 0 && (
          <div className="destinationList">
            Destinations:
            {selectionDestination.map((d, j) => {
              return (
                <span key={d}>
                  <span>{data.find((i) => i._id === d).name}</span>
                  {j < selectionDestination.length - 1 && <span>,</span>}
                </span>
              );
            })}
          </div>
        )}

        {selectionGroup.length > 0 && (
          <div className="groupList">
            Groups:
            {selectionGroup.map((d, j) => {
              return (
                <span key={d}>
                  <span>{dataGroup.find((i) => i._id === d).name}</span>
                  {j < selectionGroup.length - 1 && <span>,</span>}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
export default ListDistinations;
