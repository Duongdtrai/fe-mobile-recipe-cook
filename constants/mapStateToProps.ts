export const mapStateToProps = (state: any) => {
  return {
    userState: state.user,
    favouriteTeamState: state.favouriteTeam,
    notificationsState: state.notification,
    tabState: state.tab,
  };
};
