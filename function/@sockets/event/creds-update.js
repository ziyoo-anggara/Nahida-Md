export default async function (update, client, authState, usePairing) {
  authState.saveCreds(update);
}
