# TODO

- [x] 1) Backend: refactor pour diffuser `new_message`/notifications depuis la création REST (route `POST /conversations/:id/messages`).
- [x] 2) Frontend: `AdminMessages` envoie via REST au lieu de `socket.emit('send_message')` (garder optimistic optionnellement, mais source de vérité REST).
- [x] 3) Backend: s’assurer que le client ouvre la room (`join_conversation`) pour recevoir `new_message`.
- [ ] 4) Tests manuels: envoyer un message, vérifier persistance après refresh et réception temps réel.


