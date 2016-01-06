exports.commands = {
	/*********************************************************
	 * Clan commands
	 *********************************************************/

	ayudaclan: 'clanshelp',
	clanhelp: 'clanshelp',
	clanshelp: function () {
		if (!this.canBroadcast()) return false;
		this.sendReplyBox(
			"<big><b>Comandos Básicos:</b></big><br /><br />" +
			"/clanes - Lista los clanes.<br />" +
			"/clan (clan/miembro) - Muestra la ficha/perfil de un clan.<br />" +
			"/miembrosclan (clan/miembro) - muestra los miembros con los que cuenta un clan.<br />" +
			"/clanauth (clan/miembro) - muestra la jerarquía de miembros de un clan.<br />" +
			"/warlog (clan/miembro) - muestra las 10 últimas wars de un clan.<br />" +
			"/invitarclan - Invita a un usuario a unirse al clan. Requiere ser Oficial del clan.<br />" +
			"/expulsarclan (miembro) - Expulsa a un miembro del clan. Requiere ser sub-lider del clan.<br />" +
			"/aceptarclan (clan) - Acepta una invitación al clan.<br />" +
			"/invitacionesclan (clan/miembro) - Lista a los usuarios invitados a un clan.<br />" +
			"/borrarinvitaciones - Borra las invitaciones pendientes al Clan. Requiere ser líder del clan.<br />" +
			"/abandonarclan - Abandona el clan.<br />" +
			"<br />" +
			"<big><b>Comandos de Clan-Auth:</b></big><br /><br />" +
			"/liderclan (miembro) - Nombra a un miembro líder del clan. Requiere ~<br />" +
			"/subliderclan (miembro) - Nombra a un miembro sub-líder del clan. Requiere ser Líder del clan.<br />" +
			"/oficialclan (miembro) - Nombra a un miembro oficial del clan. Requiere ser sub-lider del clan.<br />" +
			"/demoteclan (miembro) - Borra a un miembro del staff del clan. Requiere ser Líder del clan y ~ para demotear a un Líder.<br />" +
			"/lemaclan (lema) - Establece el Lema del clan. Requiere ser líder del clan.<br />" +
			"/logoclan (logo) - Establece el Logotipo del clan. Requiere ser líder del clan.<br />" +
			"/closeclanroom - Bloquea una sala de clan a todos los que no sean miembros de dicho clan, salvo administradores.<br />" +
			"/openclanroom - Elimina el bloqueo del comando /closeclanroom.<br />" +
			"/llamarmiembros o /fjg - Llama a los miembros de un clan a su sala.<br />" +
			"/rk o /roomkick - Expulsa a un usuario de una sala. Requiere @ o superior.<br />" +
			"<br />" +
			"<big><b>Comandos de Administración:</b></big><br /><br />" +
			"/createclan &lt;name> - Crea un clan.<br />" +
			"/deleteclan &lt;name> - Elimina un clan.<br />" +
			"/addclanmember &lt;clan>, &lt;user> - Fuerza a un usuario a unirse a un clan.<br />" +
			"/removeclanmember &lt;clan>, &lt;user> - Expulsa a un usuario del clan.<br />" +
			"/setlemaclan &lt;clan>,&lt;lema> - Establece un lema para un clan.<br />" +
			"/setlogoclan &lt;clan>,&lt;logo> - Establece un logotipo para un clan.<br />" +
			"/setsalaclan &lt;clan>,&lt;sala> - Establece una sala para un clan.<br />" +
			"/setgxeclan &lt;clan>,&lt;wins>,&lt;losses>,&lt;draws> - Establece la puntuación de un clan.<br />" +
			"/serankclan &lt;clan>,&lt;puntos> - Establece la puntuación de un clan.<br />" +
			"/settitleclan &lt;clan>&lt;puntos> - Estable un título para el clan.<br />"
		);
	},

	createclan: function (target) {
		if (!this.can('clans')) return false;
		if (target.length < 2)
			this.sendReply("El nombre del clan es demasiado corto");
		else if (!Clans.createClan(target))
			this.sendReply("No se pudo crear el clan. Es posible que ya exista otro con el mismo nombre.");
		else
			this.sendReply("Clan: " + target + " creado con éxito.");

	},

	deleteclan: function (target) {
		if (!this.can('clans')) return false;
		if (!Clans.deleteClan(target))
			this.sendReply("No se pudo eliminar el clan. Es posble que no exista o que se encuentre en war.");
		else
			this.sendReply("Clan: " + target + " eliminado con éxito.");
	},

	getclans: 'clans',
	clanes: 'clans',
	clans: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		var clansTableTitle = "Lista de Clanes";
		if (toId(target) === 'rank' || toId(target) === 'puntos' || toId(target) === 'prestigio' || toId(target) === 'puntuacion') {
			target = "rank";
			clansTableTitle = "Lista de Clanes por Puntuaci&oacute;n";
		}
		if (toId(target) === 'miembros' || toId(target) === 'members') {
			target = "members";
			clansTableTitle = "Lista de Clanes por Miembros";
		}
		var clansTable = '<center><big><big><strong>' + clansTableTitle + '</strong></big></big><center><br /><table class="clanstable" width="100%" border="1" cellspacing="0" cellpadding="3" target="_blank"><tr><td><center><strong>Clan</strong></center></td><td><center><strong>Nombre Completo</strong></center></td><td><center><strong>Miembros</strong></center></td><td><center><strong>Sala</strong></center></td><td><center><strong>Wars</strong></center></td><td><center><strong>Puntuaci&oacute;n</strong></center></td></tr>';
		var clansList = Clans.getClansList(toId(target));
		var auxRating = {};
		var nMembers = 0;
		var membersClan = {};
		var auxGxe = 0;
		for (var m in clansList) {
			auxRating = Clans.getElementalData(m);
			membersClan = Clans.getMembers(m);
			if (!membersClan) {
				nMembers = 0;
			} else {
				nMembers = membersClan.length;
			}
			clansTable += '<tr><td><center>' + Tools.escapeHTML(Clans.getClanName(m)) + '</center></td><td><center>' +Tools.escapeHTML(auxRating.compname) + '</center></td><td><center>' + nMembers + '</center></td><td><center>' + '<button name="send" value="/join ' + Tools.escapeHTML(auxRating.sala) + '" target="_blank">' + Tools.escapeHTML(auxRating.sala) + '</button>' + '</center></td><td><center>' + (auxRating.wins + auxRating.losses + auxRating.draws) + '</center></td><td><center>' + auxRating.rating + '</center></td></tr>';
		}
		clansTable += '</table>';
		this.sendReply("|raw| " + clansTable);
	},

	clanauth: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		//html codes for clan ranks
		var leaderClanSource = Clans.getAuthMembers(target, 3);
		if (leaderClanSource !== "") {
			leaderClanSource = "<big><b>Líderes</b></big><br /><br />" + leaderClanSource + "</b></big></big><br /><br />";
		}
		var subLeaderClanSource = Clans.getAuthMembers(target, 2);
		if (subLeaderClanSource !== "") {
			subLeaderClanSource = "<big><b>Sub-Líderes</b></big><br /><br />" + subLeaderClanSource + "</b></big></big><br /><br />";
		}
		var oficialClanSource = Clans.getAuthMembers(target, 1);
		if (oficialClanSource !== "") {
			oficialClanSource = "<big><b>Oficiales</b></big><br /><br />" + oficialClanSource + "</b></big></big><br /><br />";
		}
		var memberClanSource = Clans.getAuthMembers(target, 0);
		if (memberClanSource !== "") {
			memberClanSource = "<big><b>Resto de Miembros</b></big><br /><br />" + memberClanSource + "</b></big></big><br /><br />";
		}

		this.sendReplyBox(
			"<center><big><big><b>Jerarquía del clan " + Tools.escapeHTML(Clans.getClanName(target)) + "</b></big></big> <br /><br />" + leaderClanSource + subLeaderClanSource + oficialClanSource + memberClanSource + '</center>'
		);
	},

	clanmembers: 'miembrosclan',
	miembrosclan: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		var nMembers = 0;
		var membersClan = Clans.getMembers(target);
		if (!membersClan) {
			nMembers = 0;
		} else {
			nMembers = membersClan.length;
		}
		this.sendReplyBox(
			"<strong>Miembros del clan " + Tools.escapeHTML(Clans.getClanName(target)) + ":</strong> " + Clans.getAuthMembers(target, "all") + '<br /><br /><strong>Número de miembros: ' + nMembers + '</strong>'
		);
	},
	invitacionesclan: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		this.sendReplyBox(
			"<strong>Invitaciones pendientes del clan " + Tools.escapeHTML(Clans.getClanName(target)) + ":</strong> " + Tools.escapeHTML(Clans.getInvitations(target).sort().join(", "))
		);
	},
	clan: 'getclan',
	getclan: function (target, room, user) {
		var autoClan = false;
		var memberClanProfile = false;
		var clanMember = "";
		if (!target) autoClan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getProfile(target);
		if (!clan) {
			clanMember = target;
			target = Clans.findClanFromMember(target);
			memberClanProfile = true;
			if (target)
				clan = Clans.getProfile(target);
		}
		if (!clan && autoClan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getProfile(target);
			memberClanProfile = true;
			clanMember = user.name;
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		var salaClanSource = "";
		if (clan.sala === "none") {
			salaClanSource = 'Aún no establecida.';
		} else {
			salaClanSource = '<button name="send" value="/join ' + Tools.escapeHTML(clan.sala) + '" target="_blank">' + Tools.escapeHTML(clan.sala) + '</button>';
		}
		var clanTitle = "";
		if (memberClanProfile) {
			var authValue = Clans.authMember(target, clanMember);
			if (authValue === 3) {
				clanTitle = clanMember + " - Líder del clan " + clan.compname;
			} else if (authValue === 2) {
				clanTitle = clanMember + " - Sub-Líder del clan " + clan.compname;
			} else if (authValue === 1) {
				clanTitle = clanMember + " - Oficial del clan " + clan.compname;
			} else {
				clanTitle = clanMember + " - Miembro del clan " + clan.compname;
			}
		} else {
			clanTitle = clan.compname;
		}
		var medalsClan = '';
		if (clan.medals) {
			for (var u in clan.medals) {
				medalsClan += '<img id="' + u + '" src="' + encodeURI(clan.medals[u].logo) + '" width="32" title="' + Tools.escapeHTML(clan.medals[u].desc) + '" />&nbsp;&nbsp;';
			}
		}
		this.sendReplyBox(
			'<div class="fichaclan">' +
			'<h4><center><p> <br />' + Tools.escapeHTML(clanTitle) + '</center></h4><hr width="90%" />' +
			'<table width="90%" border="0" align="center"><tr><td width="180" rowspan="2"><div align="center"><img src="' + encodeURI(clan.logo) +
			'" width="160" height="160" /></div></td><td height="64" align="left" valign="middle"><span class="lemaclan">'+ Tools.escapeHTML(clan.lema) +
			'</span></td> </tr>  <tr>    <td align="left" valign="middle"><strong>Sala Propia</strong>: ' + salaClanSource +
			' <p style="font-style: normal;font-size: 16px;"><strong>Puntuación</strong>:&nbsp;' + clan.rating +
			' (' + clan.wins + ' Victorias, ' + clan.losses + ' Derrotas, ' + clan.draws + ' Empates)<br />' +
			' </p> <p style="font-style: normal;font-size: 16px;">&nbsp;' + medalsClan +
			'</p></td>  </tr></table></div>'
		);
	},

	setlemaclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setlemaclan clan, lema");

		if (!Clans.setLema(params[0], params[1]))
			this.sendReply("El clan no existe o el lema es mayor de 80 caracteres.");
		else {
			this.sendReply("El nuevo lema del clan " + params[0] + " ha sido establecido con éxito.");
		}
	},

	setlogoclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setlogoclan clan, logo");

		if (!Clans.setLogo(params[0], params[1]))
			this.sendReply("El clan no existe o el link del logo es mayor de 120 caracteres.");
		else {
			this.sendReply("El nuevo logo del clan " + params[0] + " ha sido establecido con éxito.");
		}
	},

	settitleclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /settitleclan clan, titulo");

		if (!Clans.setCompname(params[0], params[1]))
			this.sendReply("El clan no existe o el título es mayor de 80 caracteres.");
		else {
			this.sendReply("El nuevo titulo del clan " + params[0] + " ha sido establecido con éxito.");
		}
	},

	setrankclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setrankclan clan, valor");

		if (!Clans.setRanking(params[0], params[1]))
			this.sendReply("El clan no existe o el valor no es válido.");
		else {
			this.sendReply("El nuevo rank para el clan " + params[0] + " ha sido establecido con éxito.");
		}
	},

	setgxeclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 4) return this.sendReply("Usage: /setgxeclan clan, wins, losses, ties");

		if (!Clans.setGxe(params[0], params[1], params[2], params[3]))
			this.sendReply("El clan no existe o el valor no es válido.");
		else {
			this.sendReply("El nuevo GXE para el clan " + params[0] + " ha sido establecido con éxito.");
		}
	},

	setsalaclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setsalaclan clan, sala");

		if (!Clans.setSala(params[0], params[1]))
			this.sendReply("El clan no existe o el nombre de la sala es mayor de 80 caracteres.");
		else {
			this.sendReply("La nueva sala del clan " + params[0] + " ha sido establecida con éxito.");
		}
	},
	
	giveclanmedal: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 4) return this.sendReply("Usage: /giveclanmedal clan, medallaId, imagen, desc");

		if (!Clans.addMedal(params[0], params[1], params[2], params[3]))
			this.sendReply("El clan no existe o alguno de los datos no es correcto");
		else {
			this.sendReply("Has entegado una medalla al clan " + params[0]);
		}
	},
	
	removeclanmedal: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /removeclanmedal clan, medallaId");

		if (!Clans.deleteMedal(params[0], params[1]))
			this.sendReply("El clan no existe o no podeía dicha medalla");
		else {
			this.sendReply("Has quitado una medalla al clan " + params[0]);
		}
	},

	lemaclan: function (target, room, user) {
		var permisionClan = false;
		if (!target) return this.sendReply("Debe especificar un lema.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 3) permisionClan = true;
			if (!permisionClan && !this.can('clans')) return false;
		} else {
			return false;
		}
		var claninfo = Clans.getElementalData (clanUser);
		if (room && room.id === toId(claninfo.sala)) {
			if (!Clans.setLema(clanUser, target))
				this.sendReply("El lema es mayor de 80 caracteres.");
			else {
				this.addModCommand("Un nuevo lema para el clan " + clanUser + " ha sido establecido por " + user.name);
			}
		} else {
			this.sendReply("Este comando solo puede ser usado en la sala del clan.");
		}
	},

	logoclan: function (target, room, user) {
		var permisionClan = false;
		if (!target) return this.sendReply("Debe especificar un logo.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 3) permisionClan = true;
			if (!permisionClan && !this.can('clans')) return false;
		} else {
			return false;
		}
		var claninfo = Clans.getElementalData (clanUser);
		if (room && room.id === toId(claninfo.sala)) {
			if (!Clans.setLogo(clanUser, target))
				this.sendReply("El logo es mayor de 120 caracteres.");
			else {
				this.addModCommand("Un nuevo logotipo para el clan " + clanUser + " ha sido establecido por " + user.name);
			}
		} else {
			this.sendReply("Este comando solo puede ser usado en la sala del clan.");
		}
	},

	llamarmiembros: 'fjg',
	fjg: function (target, room, user) {
		var permisionClan = false;
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 2 || perminsionvalue === 3) permisionClan = true;
			if (!permisionClan && !this.can('clans')) return false;
		} else {
			return false;
		}
		var claninfo = Clans.getElementalData (clanUser);
		if (room && room.id === toId(claninfo.sala)) {
			var clanMembers = Clans.getMembers(clanUser);
			var targetUser;
			for (var i = 0; i < clanMembers.length; ++i) {
				if (!room.users[toId(clanMembers[i])]) {
					targetUser = Users.get(clanMembers[i])
					if (targetUser && targetUser.connected) {
						targetUser.joinRoom(room.id);
						targetUser.popup('Has sido llamado a la sala ' + claninfo.sala.trim() + ' por ' + user.name + '.');
					}
				}
			}
			this.addModCommand("Los miembros del clan " + clanUser + " han sido llamados a la sala " + toId(claninfo.sala) + ' por ' + user.name + '.');
		} else {
			this.sendReply("Este comando solo puede ser usado en la sala del clan.");
		}
	},

	addclanmember: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (params.length !== 2) return this.sendReply("Usage: /addclanmember clan, member");

		var user = Users.getExact(params[1]);
		if (!user || !user.connected) return this.sendReply("User: " + params[1] + " is not online.");

		if (!Clans.addMember(params[0], params[1]))
			this.sendReply("Could not add the user to the clan. Does the clan exist or is the user already in another clan?");
		else {
			this.sendReply("User: " + user.name + " successfully added to the clan.");
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join">' + Tools.escapeHTML(user.name) + " se ha unido al clan: " + Tools.escapeHTML(Clans.getClanName(params[0])) + '</div>');
		}
	},

	clanleader: 'liderclan',
	liderclan: function (target, room, user) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params) return this.sendReply("Usage: /liderclan member");

		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("Usuario: " + params[0] + " no existe o no está disponible.");

		if (!Clans.addLeader(params[0]))
			this.sendReply("El usuario no existe, no pertenece a ningún clan o ya era líder de su clan.");
		else {
			var clanUser = Clans.findClanFromMember(params[0]);
			this.sendReply("Usuario: " + userk.name + " nombrado correctamente líder del clan " + clanUser + ".");
			userk.popup(user.name + " te ha nombrado Líder del clan " + clanUser + ".\nUtiliza el comando /clanhelp para más información.");
		}
	},

	clanoficial: 'oficialclan',
	oficialclan: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
				return this.sendReply("Usage: /oficialclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if ((perminsionValue === 2 || perminsionValue === 3) && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("Usuario: " + params[0] + " no existe o no está disponible.");
		if (clanTarget) {
			var clanId = toId(clanTarget);
			var userId = toId(params[0]);
			if ((Clans.authMember(clanId, userId) > 2 && !this.can('clans')) || (Clans.authMember(clanId, userId) === 2 && perminsionValue < 3 && !this.can('clans'))) return false;
		}
		if (!Clans.addOficial(params[0]))
			this.sendReply("El usuario no existe, no pertenece a ningún clan o ya era oficial de su clan.");
		else {
			this.sendReply("Usuario: " + userk.name + " nombrado correctamente oficial del clan " + clanTarget + ".");
			userk.popup(user.name + " te ha nombrado Oficial del clan " + clanTarget + ".\nUtiliza el comando /clanhelp para más información.");
		}
	},
	
	clansubleader: 'subliderclan',
	subliderclan: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
				return this.sendReply("Usage: /subliderclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionValue === 3 && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("Usuario: " + params[0] + " no existe o no está disponible.");
		if (clanTarget) {
			var clanId = toId(clanTarget);
			var userId = toId(params[0]);
			if ((Clans.authMember(clanId, userId) > 2 && !this.can('clans')) || (Clans.authMember(clanId, userId) === 2 && perminsionValue < 3 && !this.can('clans'))) return false;
		}
		if (!Clans.addSubLeader(params[0]))
			this.sendReply("El usuario no existe, no pertenece a ningún clan o ya era sub-lider de su clan.");
		else {
			this.sendReply("Usuario: " + userk.name + " nombrado correctamente sub-lider del clan " + clanTarget + ".");
			userk.popup(user.name + " te ha nombrado Sub-Lider del clan " + clanTarget + ".\nUtiliza el comando /clanhelp para más información.");
		}
	},

	degradarclan: 'declanauth',
	demoteclan: 'declanauth',
	declanauth: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
			return this.sendReply("Usage: /demoteclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionValue >= 2 && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var userk = Users.getExact(params[0]);
		if (!clanTarget) {
			return this.sendReply("El usuario no existe o no pertenece a ningún clan.");
		} else {
			var clanId = toId(clanTarget);
			var userId = toId(params[0]);
			if ((Clans.authMember(clanId, userId) > 2 && !this.can('clans')) || (Clans.authMember(clanId, userId) === 2 && perminsionValue < 3 && !this.can('clans'))) return false;
		}
		if (!Clans.deleteLeader(params[0])) {
			if (!Clans.deleteOficial(params[0])) {
				this.sendReply("El usuario no poseía ninguna autoridad dentro del clan.");
			} else {
				if (!userk || !userk.connected) {
					this.addModCommand(params[0] + " ha sido degradado de rango en " + clanTarget + " por " + user.name);
				} else {
					this.addModCommand(userk.name + " ha sido degradado de rango en " + clanTarget + " por " + user.name);
				}
			}
		} else {
			var oficialDemote = Clans.deleteOficial(params[0]);
			if (!userk || !userk.connected) {
				this.addModCommand(params[0] + " ha sido degradado de rango en " + clanTarget + " por " + user.name);
			} else {
				this.addModCommand(userk.name + " ha sido degradado de rango en " + clanTarget + " por " + user.name);
			}
		}
	},

	invitarclan: function (target, room, user) {
		var permisionClan = false;
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var permisionValue = Clans.authMember(clanUserid, iduserwrit);
			if (permisionValue > 0) permisionClan = true;
		}
		if (!permisionClan) return this.sendReply("/invitarclan - Acceso denegado");
		var params = target.split(',');
		if (!params) return this.sendReply("Usage: /invitarclan user");
		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("Usuario: " + params[0] + " no existe o no está disponible.");
		if (!Clans.addInvite(clanUser, params[0]))
			this.sendReply("No se pudo invitar al usuario. ¿No existe, ya está invitado o está en otro clan?");
		else {
			clanUser = Clans.findClanFromMember(user.name);
			userk.popup(user.name + " te ha invitado a unirte al clan " + clanUser + ".\nPara unirte al clan escribe en el chat /aceptarclan " + clanUser);
			room.addRaw(userk.name + " ha sido invitado a unirse al clan " + clanUser + " por " + user.name);
		}
	},
	aceptarclan: function (target, room, user) {
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			return this.sendReply("Ya perteneces a un clan. No te puedes unir a otro.");
		}
		var params = target.split(',');
		if (!params) return this.sendReply("Usage: /aceptarclan clan");
		var clanpropio = Clans.getClanName(params[0]);
		if (!clanpropio) return this.sendReply("El clan no existe o no está disponible.");

		if (!Clans.aceptInvite(params[0], user.name))
			this.sendReply("El clan no existe o no has sido invitado a este.");
		else {
			this.sendReply("Te has unido correctamente al clan" + clanpropio);
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join">' + Tools.escapeHTML(user.name) + " se ha unido al clan: " + Tools.escapeHTML(Clans.getClanName(params[0])) + '</div>');
		}
	},
	inviteclear: 'borrarinvitaciones',
	borrarinvitaciones: function (target, room, user) {
		var permisionClan = false;
		var clanUser = Clans.findClanFromMember(user.name);
		if (!target) {
			if (clanUser) {
				var clanUserid = toId(clanUser);
				var iduserwrit = toId(user.name);
				var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
				if (perminsionvalue === 3) permisionClan = true;
			}
			if (!permisionClan) return false;
		} else {
			if (!this.can('clans')) return;
			clanUser = target;
		}
		if (!Clans.clearInvitations(clanUser))
			this.sendReply("El clan no existe o no está disponible.");
		else {
			this.sendReply("Lista de Invitaciones pendientes del clan " + clanUser + " borrada correctamente.");
		}
	},

	removeclanmember: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (params.length !== 2) return this.sendReply("Usage: /removeclanmember clan, member");
		if (!Clans.removeMember(params[0], params[1]))
			this.sendReply("Could not remove the user from the clan. Does the clan exist or has the user already been removed from it?");
		else {
			this.sendReply("User: " + params[1] + " successfully removed from the clan.");
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join">' + Tools.escapeHTML(params[1]) + " ha abandonado el clan: " + Tools.escapeHTML(Clans.getClanName(params[0])) + '</div>');
		}
	},

	expulsarclan: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
				return this.sendReply("Usage: /expulsarclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionValue >= 2 && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var currentWar = War.findClan(clanTarget);
		if (currentWar) {
			var currentWarParticipants = War.getTourData(currentWar);
			if (currentWarParticipants.teamAMembers[toId(params[0])] || currentWarParticipants.teamBMembers[toId(params[0])]) return this.sendReply("No puedes expulsar del clan si el miembro estaba participando en una war.");
		}
		var userk = Users.getExact(params[0]);
		if (!clanTarget) {
			return this.sendReply("El usuario no existe o no pertenece a ningún clan.");
		} else {
			var clanId = toId(clanTarget);
			var userId = toId(params[0]);
			if ((Clans.authMember(clanId, userId) > 2 && !this.can('clans')) || (Clans.authMember(clanId, userId) === 2 && perminsionValue < 3 && !this.can('clans'))) return false;
		}
		if (!Clans.removeMember(clanTarget, params[0])) {
			this.sendReply("El usuario no pudo ser expulsado del clan.");
		} else {
			if (!userk || !userk.connected) {
				this.addModCommand(params[0] + " ha sido expulsado del clan " + clanTarget + " por " + user.name);
			} else {
				this.addModCommand(userk.name + " ha sido expulsado del clan " + clanTarget + " por " + user.name);
			}
		}
	},

	 salirdelclan: 'abandonarclan',
	 clanleave: 'abandonarclan',
	 abandonarclan: function (target, room, user) {
		var clanUser = Clans.findClanFromMember(user.name);
		if (!clanUser) {
			return this.sendReply("No perteneces a ningún clan.");
		}
		var currentWar = War.findClan(clanUser);
		if (currentWar) {
			var currentWarParticipants = War.getTourData(currentWar);
			if (currentWarParticipants.teamAMembers[toId(user.name)] || currentWarParticipants.teamBMembers[toId(user.name)]) return this.sendReply("No puedes salir del clan si estabas participando en una war.");
		}
		if (!Clans.removeMember(clanUser, user.name)) {
			 this.sendReply("Error al intentar salir del clan.");
		} else {
			this.sendReply("Has salido del clan" + clanUser);
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join">' + Tools.escapeHTML(user.name) + " ha abandonado el clan: " + Tools.escapeHTML(Clans.getClanName(clanUser)) + '</div>');
		}
	},


	//new war system
	resetclanranking: function (target, room, user) {
		if (!this.can('clans')) return false;
		if (room.id !== 'staff') return this.sendReply("Este comando solo puede ser usado en la sala Staff");
		Clans.resetClansRank();
		this.addModCommand(user.name + " ha reiniciado el ranking de clanes.");
	},
	
	resetwarlog: function (target, room, user) {
		if (!this.can('clans')) return false;
		if (room.id !== 'staff') return this.sendReply("Este comando solo puede ser usado en la sala Staff");
		Clans.resetWarLog();
		this.addModCommand(user.name + " ha borrado todos los warlogs.");
	},
	
	pendingwars: 'wars',
	wars: function (target, room, user) {
		this.parse("/war search");
	},

	viewwar: 'vw',
	warstatus: 'vw',
	vw: function (target, room, user) {
		this.parse("/war round");
	},
	
	endwar: function (target, room, user) {
		this.parse("/war end");
	},
	
	warlog: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		var f = new Date();
		var dateWar = f.getDate() + '-' + f.getMonth() + ' ' + f.getHours() + 'h';
		this.sendReply(
			"|raw| <center><big><big><b>Ultimas Wars del clan " + Tools.escapeHTML(Clans.getClanName(target)) + "</b></big></big> <br /><br />" + Clans.getWarLogTable(target) + '<br /> Fecha del servidor: ' + dateWar + '</center>'
		);
	},
	
	cerrarsalaclan: 'closeclanroom',
	closeclanroom: function (target, room, user) {
		var permisionClan = false;
		var clanRoom = Clans.findClanFromRoom(room.id);
		if (!clanRoom) return this.sendReply("Esta no es una sala de Clan.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser && toId(clanRoom) === toId(clanUser)) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue >= 2) permisionClan = true;
			
		} 
		if (!permisionClan && !this.can('clans')) return false;
		if (!Clans.closeRoom(room.id, clanRoom))
			this.sendReply("Error al intentar cerrar la sala. Es posible que ya esté cerrada.");
		else {
			this.addModCommand("Esta sala ha sido cerrada a quienes no sean miembros de " + clanRoom + " por " + user.name);
		}
	},
	
	abrirsalaclan: 'openclanroom',
	openclanroom: function (target, room, user) {
		var permisionClan = false;
		var clanRoom = Clans.findClanFromRoom(room.id);
		if (!clanRoom) return this.sendReply("Esta no es una sala de Clan.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser && toId(clanRoom) === toId(clanUser)) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue >= 2) permisionClan = true;
			
		} 
		if (!permisionClan && !this.can('clans')) return false;
		if (!Clans.openRoom(room.id, clanRoom))
			this.sendReply("Error al intentar abrir la sala. Es posible que ya esté abierta.");
		else {
			this.addModCommand("Esta sala ha sido abierta a todos los usuarios por " + user.name);
		}
	},
	
	kickall: function (target, room, user, connection) {
		if (!this.can('makeroom')) return false;
		var targetUser;
		for (var f in room.users) {
			targetUser = Users.getExact(room.users[f]);
			if (!targetUser) {
				delete room.users[f];
			} else {
				targetUser.leaveRoom(room.id);
			}
		}
		room.userCount = 0;
		this.addModCommand("" + user.name + " has kicked all users from room " + room.id + '.');
		setTimeout(function () {user.joinRoom(room.id);}, 2000);
	},
	
	/* War */
	
	guerra: 'war',
	war: function(target, room, user, connection) {
		var roomId = room.id;
		var params;
		if (!target) {
			params = ['round'];
		} else {
			params = target.split(',');
		}
		switch (toId(params[0])) {
			case 'buscar':
			case 'search':
				if (!this.canBroadcast()) return false;
				this.sendReplyBox(War.getTours());
				break;
			case 'help':
				if (!this.canBroadcast()) return false;
				this.sendReplyBox(
					'<font size = 2>Guerras entre clanes</font><br />' +
					'Se trata de un sistema automatizado de guerras (enfrentamientos) entre 2 clanes dentro de un sistema de puntuación o ranking. Las wars solo pueden ser iniciadas en las salas destinadas a ello. Los Voiced pueden crearlas y terminarlas y el staff puede manejar el resto de comandos administrativos. Asi mismo, los oficiales y líderes de los clanes pueden descalificar y reemplazar a sus miembros.<br />' +
					'Los comandos están compactados en /war y son los siguientes:<br />' +
					'<ul><li>/war new, [standard/total], [tier/multitier], [tamaño], [clanA], [clanB] - Crea una guerra.</li>' +
					'<li>/war new, [lineups], [tier/multitier], [tamaño], [clanA], [clanB], [capitanA], [capitanB] - Crea una guerra con alinaciones fijas.</li>' +
					'<li>/war end - finaliza una guerra en curso.</li>' +
					'<li>/war join - Comando para unirse.</li>' +
					'<li>/war leave - Comando para salir.</li>' +
					'<li>/war - Muestra el estado de la guerra.</li>' +
					'<li>/war dq, [usuario] - Comando para descalificar.</li>' +
					'<li>/war replace, [usuario1], [usuario2] - Comando para reemplazar.</li>' +
					'<li>/war invalidate, [participante] - Comando para invalidar una batalla o un resultado.</li>' +
					'<li>/war size, [Jugadores por team] - Cambia el tamaño de la guerra.</li>' +
					'<li>/war auth, [Capitan1], [Capitan2] - Establece los capitanes de los clanes.</li>' +
					'<li>/war reg, [P1], [P2]... - Comando para registrar alineaciones, solo usable por los capitanes.</li>' +
					'<li>/war start - Inicia una guerra una vez registradas las alineaciones.</li>' +
					'<li>/war search - Muestra las guerras en curso del servidor.</li>' +
					'</ul>');
				break;
			case 'nuevo':
			case 'new':
			case 'create':
				if (params.length < 6) return this.sendReply("Usage: /war new, [standard/total/lineups], [tier/multitier], [tamaño], [clanA], [clanB]");
				if (!this.can('joinbattle', room)) return false;
				if (!room.isOfficial) return this.sendReply("Este comando solo puede ser usado en salas Oficiales.");
				if (War.getTourData(roomId)) return this.sendReply("Ya había una guerra en esta sala.");
				if (tour[roomId] && tour[roomId].status != 0) return this.sendReply('Ya hay un torneo en  esta sala.');
				if (teamTour.getTourData(roomId)) return this.sendReply("Ya había un torneo de equipos en esta sala.");
				var size = parseInt(params[3]);
				if (size < 3) return this.sendReply("Mínimo deben ser 3 jugadores por clan.");
				var format = War.tourTiers[toId(params[2])];
				if (!format) return this.sendReply("Formato no válido.");
				if (!Clans.getProfile(params[4]) || !Clans.getProfile(params[5])) return this.sendReply("Alguno de los clanes no existía.");
				if (War.findClan(params[4]) || War.findClan(params[5])) return this.sendReply("Alguno de los clanes ya estaba en guerra.");
				params[4] = Clans.getClanName(params[4]);
				params[5] = Clans.getClanName(params[5]);
				switch (toId(params[1])) {
					case 'standard':
						War.newTeamTour(room.id, 'standard', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]));
						this.logModCommand(user.name + " ha iniciado una guerra standard entre los clanes " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado una guerra standard en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2><b>Para unirse a la war: <button name="send" value="/war join">/war join</button></b><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración de la guerra.</b></font>');
						break;
					case 'total':
						War.newTeamTour(room.id, 'total', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]));
						this.logModCommand(user.name + " ha iniciado una guerra total entre los clanes " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado una guerra total en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2><b>Para unirse a la war: <button name="send" value="/war join">/war join</button></b><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración de la guerra.</b></font>');
						break;
					case 'lineups':
						if (params.length < 8) return this.sendReply("Usage: /war new, lineups, [tier/multitier], [tamano], [clanA], [clanB], [capitanA], [capitanB]");
						var targetClan;
						var userCapA = Users.getExact(params[6]);
						if (!userCapA) return this.sendReply("El usuario " + Tools.escapeHTML(params[6]) + " no está disponible.");
						targetClan = Clans.findClanFromMember(userCapA.name);
						if (toId(targetClan) !== toId(params[4])) return this.sendReply("El usuario " + Tools.escapeHTML(params[6]) + " no pertenece al clan del que se le asigna capitan.");
						var userCapB = Users.getExact(params[7]);
						if (!userCapB) return this.sendReply("El usuario " + Tools.escapeHTML(params[7]) + " no está disponible.");
						targetClan = Clans.findClanFromMember(userCapB.name);
						if (toId(targetClan) !== toId(params[5])) return this.sendReply("El usuario " + Tools.escapeHTML(params[7]) + " no pertenece al clan del que se le asigna capitan.");
						War.newTeamTour(room.id, 'lineups', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]), userCapA.name, userCapB.name);
						this.logModCommand(user.name + " ha iniciado una guerra con alineaciones entre los clanes " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado una guerra por Alineaciones en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2><b><font color="orange">Capitanes de equipo: </font>' + userCapA.name + ' y ' + userCapB.name + '</font></b> <br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><b><font color="red">Recuerda que debes mantener tu nombre durante toda la duración del torneo.</font> <br />Los capitales deben usar /war reg, [miembro1], [miembro2]... para registrar las alineaciones.</b>');
						break;
					default:
						return this.sendReply("El tipo de war debe ser uno de estos: [standard/total/lineups]");
				}
				break;
			case 'end':
			case 'fin':
			case 'delete':
				if (!this.can('joinbattle', room)) return false;
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala.");
				this.logModCommand(user.name + " ha cancelado la guerra entre " + toId(tourData.teamA) + " y " + toId(tourData.teamB) + ".");
				Rooms.rooms[room.id].addRaw('<hr /><center><h2><font color="green">' + user.name + ' ha cancelado la guerra entre ' + tourData.teamA + " y " + tourData.teamB + '.</h2></font></center><hr />');
				War.endTeamTour(roomId);
				break;
			case 'j':
			case 'unirse':
			case 'join':
				var err = War.joinTeamTour(roomId, user.name, Clans.findClanFromMember(user.name));
				if (err) return this.sendReply(err);
				var tourData = War.getTourData(roomId);
				var freePlaces =  War.getFreePlaces(roomId); 
				if (freePlaces > 0) {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido a la guerra. Quedan ' + freePlaces + ' plazas.');
				} else {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido a la guerra. Comienza la guerra!');
					War.startTeamTour(roomId);
					Rooms.rooms[room.id].addRaw(War.viewTourStatus(roomId));
				}
				break;
			case 'l':
			case 'salir':
			case 'leave':
				var err = War.leaveTeamTour(roomId, user.name);
				if (err) return this.sendReply(err);
				var freePlaces =  War.getFreePlaces(roomId);
				Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha salido de la guerra. Quedan ' + freePlaces + ' plazas.');
				break;
			case 'auth':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 3) return this.sendReply("Usage: /war auth, [Capitan1], [Capitan2]");
				var targetClan;
				var tourData = War.getTourData(roomId);
				var userCapA = Users.getExact(params[1]);
				if (!userCapA) return this.sendReply("El usuario " + Tools.escapeHTML(params[1]) + " no está disponible.");
				targetClan = Clans.findClanFromMember(userCapA.name);
				if (toId(targetClan) !== toId(tourData.teamA)) return this.sendReply("El usuario " + Tools.escapeHTML(params[1]) + " no pertenece al clan del que se le asigna capitan.");
				var userCapB = Users.getExact(params[2]);
				if (!userCapB) return this.sendReply("El usuario " + Tools.escapeHTML(params[2]) + " no está disponible.");
				targetClan = Clans.findClanFromMember(userCapB.name);
				if (toId(targetClan) !== toId(tourData.teamB)) return this.sendReply("El usuario " + Tools.escapeHTML(params[2]) + " no pertenece al clan del que se le asigna capitan.");
				var err = War.setAuth(roomId, params[1], params[2]);
				if (err) return this.sendReply(err);
				this.privateModCommand('(' + user.name + ' ha cambiado los Capitanes de la guerra actual)');
				break;
			case 'lineup':
			case 'alineacion':
			case 'registrar':
			case 'reg':
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala");
				if (toId(user.name) !== toId(tourData.authA) && toId(user.name) !== toId(tourData.authB)) return this.sendReply("Debes ser Capitan de uno de los dos clanes para hacer esto.");
				var err = War.regParticipants(roomId, user.name, target);
				if (err) return this.sendReply(err);
				if (toId(user.name) === toId(tourData.authA)) Rooms.rooms[room.id].addRaw(user.name + ' ha registrado la alinación para ' + tourData.teamA + '.');
				if (toId(user.name) === toId(tourData.authB)) Rooms.rooms[room.id].addRaw(user.name + ' ha registrado la alinación para ' + tourData.teamB + '.');
				break;
			case 'empezar':
			case 'begin':
			case 'start':
				if (!this.can('joinbattle', room)) return false;
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala.");
				if (tourData.tourRound !== 0) return this.sendReply("La guerra ya había empezado.");

				var freePlaces =  War.getFreePlaces(roomId);
				if (freePlaces > 0) return this.sendReply("Aún quedan plazas libres.");
				War.startTeamTour(roomId);
				Rooms.rooms[room.id].addRaw(War.viewTourStatus(roomId));
				break;
			case 'size':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /war size, [size]");
				var err = War.sizeTeamTour(roomId, params[1]);
				if (err) return this.sendReply(err);
				var freePlaces =  War.getFreePlaces(roomId);
				if (freePlaces > 0) {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha cambiado el tama&ntilde;o de la guerra a ' + parseInt(params[1]) + '. Quedan ' + freePlaces + ' plazas.');
				} else {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha cambiado el tama&ntilde;o de la guerra a ' + parseInt(params[1]) + '. Comienza la guerra!');
					War.startTeamTour(roomId);
					Rooms.rooms[room.id].addRaw(War.viewTourStatus(roomId));
				}
				break;
			case 'disqualify':
			case 'dq':
				if (params.length < 2) return this.sendReply("Usage: /war dq, [user]");
				var clanUser = Clans.findClanFromMember(params[1]);
				var canReplace = false;
				if (clanUser && (Clans.authMember(clanUser, user.name) === 1 || Clans.authMember(clanUser, user.name) === 2 || Clans.authMember(clanUser, user.name) === 3)) canReplace = true;
				if (!canReplace && !this.can('tournamentsmoderation', room)) return false;
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala");
				if (!War.dqTeamTour(roomId, params[1], 'cmd')) return this.sendReply("No se pudo descalificar al usuario.");
				var userk = Users.getExact(params[1]);
				if (userk) userk = userk.name; else userk = toId(params[1]);
				this.addModCommand(userk + ' fue descalificado de la guerra por ' + user.name + '.');
				if (War.isRoundEnded(roomId)) {
					War.autoEnd(roomId);
				}
				break;
			case 'replace':
				if (params.length < 3) return this.sendReply("Usage: /war replace, [userA], [userB]");
				var clanUser = Clans.findClanFromMember(params[1]);
				var canReplace = false;
				if (clanUser && (Clans.authMember(clanUser, user.name) === 1 || Clans.authMember(clanUser, user.name) === 2 || Clans.authMember(clanUser, user.name) === 3)) canReplace = true;
				if (!canReplace && !this.can('tournamentsmoderation', room)) return false;
				var clanReplace = Clans.findClanFromMember(params[2]);
				if (toId(clanUser) !== toId(clanReplace)) return this.sendReply("Al reemplazar en una guerra, ambos usuarios deben pertener al mismo clan");
				var usera = Users.getExact(params[1]);
				if (usera) usera = usera.name; else usera = toId(params[1]);
				var userb = Users.getExact(params[2]);
				if (userb) {
					userb = userb.name;
				} else {
					return this.sendReply("El usuario por el que reemplazas debe estár conectado.");
				}
				var err = War.replaceParticipant(roomId, params[1], params[2]);
				if (err) return this.sendReply(err);
				this.addModCommand(user.name + ': ' + usera + ' es reemplazado por ' + userb + ' en la guerra.');
				break;
			case 'invalidate':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /war invalidate, [user]");
				var tourData = War.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ninguna guerra en esta sala.");
				var matchupId = War.findMatchup(roomId, params[1]);
				if (!War.invalidate(roomId, matchupId)) return this.sendReply("No se pudo invalidar el resultado. Puede que aún no se haya establecido ningún resultado.");
				this.addModCommand('La batalla entre ' + tourData.matchups[matchupId].from + ' y ' + tourData.matchups[matchupId].to + ' fue invalidada por ' + user.name + '.');
				break;
			case 'hotpatch':
				if (!this.can('hotpatch')) return false;
				CommandParser.uncacheTree('./war.js');
				War = require('./war.js');
				return this.sendReply('Wars hotpatched.');
			case 'ronda':
			case 'round':
				if (!this.canBroadcast()) return false;
				return this.sendReply('|raw|' + War.viewTourStatus(roomId));
			default:
				this.sendReply('No se reconoce el comando. Quizás te pueda ayuadar /war help.');
		}
	},
	/* Tour Commands */
	
	tourhelp: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size = 2>Sistema de torneos  clásico</font><br />' +
						'Sistema de torneos clásico. Disponible para las salas, permitiendo a los usuarios con auth (+ % @ # & ~) crearlos y moderarlos.<br />' +
						'Los comandos son:<br />' +
						'<ul><li>/newtour [formato], [tiempo] minutes - Inicia un torneo. Requiere: + % @ & ~</li>' +
						'<li>/j - Comando para unirse a los tourneos.</li>' +
						'<li>/l - comando para abandonar un torneo.</li>' +
						'<li>/remind - recuerda a los usuarios con batallas pendientes.</li>' +
						'<li>/vr - muestra el estado del torneo.</li>' +
						'<li>/fl [usuario] - Fuerza a un usuario a salir de un torneo en fase de entrada.</li>' +
						'<li>/dq [usuario] - Descalifica a un usuario.</li>' +
						'<li>/replace [usuario1], [usuario2] - Comando para reemplazar.</li>' +
						'<li>/invalidate - Deniega la validez de una batalla.</li>' +
						'<li>/endtour - Cancela el torneo.</li>' +
						'</ul>');
	},
	
	createtour: 'newtour',
	newtour: function(target, room, user, connection) {
		if (target == "update" && this.can('hotpatch')) {
			CommandParser.uncacheTree('./tour.js');
			tour = require('./tour.js').tour(tour);
			return this.sendReply('El codigo de los torneos ha sido actualizado.');
		}
		if (!tour.midauth(user,room)) return this.parse('/tours');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		var rid = room.id;
		if (tour[rid] && tour[rid].status != 0) return this.sendReply('Ya hay un torneo en curso.');
		if (War.getTourData(room.id)) return this.sendReply("Ya había una guerra en esta sala.");
		if (teamTour.getTourData(room.id)) return this.sendReply("Ya había un torneo de equipos en esta sala.");
		if (!target) return this.sendReply('El comando correcto es: /newtour formato, tamano');
		var targets = tour.splint(target);
		if (targets.length != 2) return this.sendReply('El comando correcto es: /newtour formato, tamano');
		var tierMatch = false;
		var tempTourTier = '';
		for (var i = 0; i < tour.tiers.length; i++) {
			if (toId(targets[0]) == tour.tiers[i]) {
				tierMatch = true;
				tempTourTier = tour.tiers[i];
			}
		}
		if (!tierMatch) return this.sendReply('Por favor utiliza uno de los siguientes formatos: ' + tour.tiers.join(','));
		if (targets[1].split('minut').length) {
			targets[1] = parseInt(targets[1]);
			if (isNaN(targets[1]) || !targets[1]) return this.sendReply('/newtour formato, NUMERO minutes');
			targets[1] = Math.ceil(targets[1]);
			if (targets[1] < 0) return this.sendReply('Por que programar este torneo para el pasado?');
			tour.timers[rid] = {
				time: targets[1],
				startTime: tour.currentSeconds
			};
			targets[1] = Infinity;
		}
		else {
			targets[1] = parseInt(targets[1]);
		}
		if (isNaN(targets[1])) return this.sendReply('El comando correcto es: /newtour formato, tamano');
		if (targets[1] < 3) return this.sendReply('Los torneos deben tener al menos 3 participantes.');

		this.parse('');
		tour.reset(rid);
		tour[rid].tier = tempTourTier;
		tour[rid].size = targets[1];
		tour[rid].status = 1;
		tour[rid].players = new Array();

		Rooms.rooms[rid].addRaw('<hr /><h2><font color="green">' + Tools.escapeHTML(user.name) + ' ha iniciado un torneo de formato ' + Tools.data.Formats[tempTourTier].name + '. Si deseas unirte escribe </font> <font color="red">/j</font> <font color="steelblue">.</font></h2><b><font color="blueviolet">Jugadores:</font></b> ' + targets[1] + '<br /><font color="blue"><b>FORMATO:</b></font> ' + Tools.data.Formats[tempTourTier].name + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante todo el torneo.</b></font>');
		if (tour.timers[rid]) Rooms.rooms[rid].addRaw('<i>El torneo empezara en ' + tour.timers[rid].time + ' minuto' + (tour.timers[rid].time == 1 ? '' : 's') + '.<i>');
	},

	endtour: function(target, room, user, connection) {
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('No hay un torneo activo.');
		tour[room.id].status = 0;
		delete tour.timers[room.id];
		room.addRaw('<h2><b>' + user.name + '</b> ha cerrado el torneo.</h2>');
	},

	toursize: function(target, room, user, connection) {
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined) return this.sendReply('No hay un torneo activo en esta sala.');
		if (tour[room.id].status > 1) return this.sendReply('Es imposible cambiar el numero de participantes.');
		if (tour.timers[room.id]) return this.sendReply('Este torneo tiene un numero abierto de participantes, no puede ser cambiado.');
		if (!target) return this.sendReply('El comando correcto es: /toursize tamano');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('El comando correcto es: /toursize tamano');
		if (target < 3) return this.sendReply('Un torneo requiere por lo menos 3 personas.');
		if (target < tour[room.id].players.length) return this.sendReply('No puedes reducir el numero de participantes a un numero inferior de los ya registrados.');
		tour[room.id].size = target;
		tour.reportdue(room);
		room.addRaw('<b>' + user.name + '</b> ha cambiado el tamano del torneo a ' + target + '. Queda <b><i>' + (target - tour[room.id].players.length) + ' plaza' + ( ( target - tour[room.id].players.length ) == 1 ? '' : 's') + '.</b></i>');
		if (target == tour[room.id].players.length) tour.start(room.id);
	},

	tourtime: function(target, room, user, connection) {
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined) return this.sendReply('No hay un torneo activo en esta sala.');
		if (tour[room.id].status > 1) return this.sendReply('Es imposible cambiar el numero de participantes.');
		if (!tour.timers[room.id]) return this.sendReply('Este torneo no funciona con un reloj.');
		if (!target) return this.sendReply('El comando correcto es: /tourtime tiempo');
		target = parseInt(target);
		if (isNaN(target)) return this.sendReply('El comando correcto es: /tourtime tiempo');
		if (target < 1) return this.sendReply('Por que reprogramar un torneo para el pasado?');
		target = Math.ceil(target);
		tour.timers[room.id].time = target;
		tour.timers[room.id].startTime = tour.currentSeconds;
		room.addRaw('<b>' + user.name + '</b> ha cambiado el tiempo de registro a: ' + target + ' minuto' + (target === 1 ? '' : 's') + '.');
		if (target === 0) {
			tour.reportdue(room);
			tour.start(room.id);
		}
	},

	jt: 'j',
	jointour: 'j',
	j: function(target, room, user, connection) {
		if (room.decision) return this.sendReply('No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (War.getTourData(room.id)) return this.parse("/war join");
		if (teamTour.getTourData(room.id))return this.parse("/tt join, " + target);
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('No hay torneos activos en esta sala.');
		if (tour[room.id].status == 2) return this.sendReply('Ya no te puedes registrar a este torneo.');
		if (tour.joinable(user.userid, room.id)) {
			tour[room.id].players.push(user.userid);
			var remslots = tour[room.id].size - tour[room.id].players.length;
			// these three assignments (natural, natural, boolean) are done as wished
			if (isFinite(tour[room.id].size)) {
			var pplogmarg = Math.ceil(Math.sqrt(tour[room.id].size) / 2);
			var logperiod = Math.ceil(Math.sqrt(tour[room.id].size));
			} else {
			var pplogmarg = 3;
			var logperiod = 4;
			}
			var perplayerlog = ( ( tour[room.id].players.length <= pplogmarg ) || ( remslots + 1 <= pplogmarg ) );
			//

			if (perplayerlog || (tour[room.id].players.length - tour[room.id].playerslogged.length >= logperiod) || ( remslots <= pplogmarg ) ) {
				tour.reportdue(room, connection);
			} else {
				this.sendReply('Te has unido exitosamente al torneo.');
			}
			if (tour[room.id].size == tour[room.id].players.length) tour.start(room.id);
		} else {
			return this.sendReply('No puedes entrar el torneo porque ya estas en el. Digita /l para salir.');
		}
	},

	lt: 'l',
	leavetour: 'l',
	l: function(target, room, user, connection) {
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (War.getTourData(room.id)) return this.parse("/war leave");
		if (teamTour.getTourData(room.id))return this.parse("/tt leave");
		if (tour[room.id] == undefined || tour[room.id].status == 0) return this.sendReply('No hay un torneo activo que abandonar.');
		if (tour[room.id].status == 1) {
			var index = tour[room.id].players.indexOf(user.userid);
			if (index !== -1) {
				if (tour[room.id].playerslogged.indexOf(user.userid) !== -1) {
					tour.reportdue(room);
					tour[room.id].players.splice(index, 1);
					tour[room.id].playerslogged.splice(index, 1);
					var remslots = tour[room.id].size - tour[room.id].players.length;
					room.addRaw('<b>' + user.name + '</b> ha salido del torneo.' + tour.remsg(remslots));
				} else {
					tour[room.id].players.splice(index, 1);
					return this.sendReply('Has salido del torneo.');
				}
			} else {
				return this.sendReply("No estabas en el torneo.");
			}
		} else {
			var dqopp = tour.lose(user.userid, room.id);
			if (dqopp && dqopp != -1 && dqopp != 1) {
				room.addRaw('<b>' + user.name + '</b> ha salido del torneo. <b>' + tour.username(dqopp) + '</b> pasa a la siguiente ronda.');
				var r = tour[room.id].round;
				var c = 0;
				for (var i in r) {
					if (r[i][2] && r[i][2] != -1) c++;
				}
				if (r.length == c) tour.nextRound(room.id);
			} else {
				if (dqopp == 1) return this.sendReply("Debes esperar hasta la proxima ronda para salir del torneo.");
				if (dqopp == 0 || dqopp == -1) return this.sendReply("No estas en el torneo o tu oponente no esta disponible.");
			}
		}
	},

	forceleave: 'fl',
	fl: function(target, room, user, connection) {
		if (!tour.lowauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined || tour[room.id].status == 0 || tour[room.id].status == 2) return this.sendReply('El torneo no esta en su fase de inscripcion. Utiliza /dq para sacar a alguien del torneo.');
		if (!target) return this.sendReply('Especifica el usuario que deseas sacar.');
		var targetUser = Users.get(target);
		if (targetUser) {
			target = targetUser.userid;
		} else {
			return this.sendReply('El usuario \'' + target + '\' no existe.');
		}
		var index = tour[room.id].players.indexOf(target);
		if (index !== -1) {
			tour.reportdue(room);
			tour[room.id].players.splice(index, 1);
			tour[room.id].playerslogged.splice(index, 1);
			var remslots = tour[room.id].size - tour[room.id].players.length;
			room.addRaw(user.name + ' ha expulsado del torneo a <b>' + tour.username(target) + '</b>.' + tour.remsg(remslots));
		} else {
			return this.sendReply('El usuario no esta en el torneo.');
		}
	},

	remind: function(target, room, user, connection) {
		if (!tour.lowauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined || !tour[room.id].status) return this.sendReply('No hay un torneo activo en esta sala.');
		if (tour[room.id].status == 1) {
			tour.reportdue(room);
			room.addRaw('<hr /><h2><font color="green">Inscribanse al torneo de formato ' + Tools.data.Formats[tour[room.id].tier].name + '. Escribe </font> <font color="red">/j</font> <font color="green">para inscribirte.</font></h2><b><font color="blueviolet">Jugadores:</font></b> ' + (tour[room.id].size === 'Infinity' ? 'ILIMITADOS' : tour[room.id].size) + '<br /><font color="blue"><b>FORMATO:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + '<hr />');
		} else {
			var c = tour[room.id];
			var unfound = [];
			if (!target) {
				for (var x in c.round) {
					if (c.round[x][0] && c.round[x][1] && !c.round[x][2]) {
						var userOne = Users.get(c.round[x][0]);
						var userTwo = Users.get(c.round[x][1]);
						if (userOne && userOne.connected) {
							userOne.popup("Se te recuerda que tienes una batalla de torneo pendiente en la sala " + room.title + ". Si no inicias pronto tu batalla contra " + tour.username(c.round[x][1]) + " en el formato " + Tools.data.Formats[tour[room.id].tier].name + ", podrias ser descalificado.");
						} else {
							unfound.push(c.round[x][0]);
						}
						if (userTwo && userTwo.connected) {
							userTwo.popup("Se te recuerda que tienes una batalla de torneo pendiente en la sala " + room.title + ". Si no inicias pronto tu batalla contra " + tour.username(c.round[x][0]) + " en el formato " + Tools.data.Formats[tour[room.id].tier].name + ", podrias ser descalificado.");
						} else {
							unfound.push(c.round[x][1]);
						}
					}
				}
			} else {
				var opponent = '';
				var targets = tour.splint(target);
				for (var i=0; i<targets.length; i++) {
					var nicetarget = false;
					var someuser = Users.get(targets[i]);
					if (someuser) {
						for (var x in c.round) {
							if (c.round[x][0] && c.round[x][1] && !c.round[x][2]) {
								if (c.round[x][0] === someuser.userid) {
									nicetarget = true;
									opponent = c.round[x][1];
									break;
								} else if (c.round[x][1] === someuser.userid) {
									nicetarget = true;
									opponent = c.round[x][0];
									break;
								}
							}
						}
					}
					if (nicetarget) {
						someuser.popup("Se te recuerda que tienes una batalla de torneo pendiente en la sala " + room.title + ". Si no inicias pronto tu batalla contra " + tour.username(opponent) + " en el formato " + Tools.data.Formats[tour[room.id].tier].name + ", podrias ser descalificado.");
					} else {
						unfound.push(someuser.name);
					}
				}
			}
			room.addRaw("Los usuarios con batallas pendientes en el torneo han sido recordados de el por " + user.name);
			if (unfound.length) return this.sendReply("Los siguientes usuarios estaban desconectados o no tenian batallas pendientes: " + unfound.toString());
		}
	},

	viewround: 'vr',
	viewreport: 'vr',
	vr: function(target, room, user, connection) {
		if (War.getTourData(room.id)) return this.parse("/war round");
		if (teamTour.getTourData(room.id))return this.parse("/tt round");
		if (!tour[room.id].status) {
			if (!this.canBroadcast()) return;
			var oghtml = "<hr /><h2>Torneos en su fase de entrada:</h2>";
			var html = oghtml;
			for (var i in tour) {
				var c = tour[i];
				if (typeof c == "object") {
					if (c.status == 1) html += '<button name="joinRoom" value="' + i + '">' + Rooms.rooms[i].title + ' - ' + Tools.data.Formats[c.tier].name + '</button> ';
				}
			}
			if (html == oghtml) html += "No hay torneos en su fase de entrada.";
			this.sendReply('|raw|' + html + "<hr />");
		} else if (tour[room.id].status == 1) {
			if (!tour.lowauth(user,room)) return this.sendReply('No deberias usar este comando en la fase de inscripcion.');
			tour.reportdue(room, connection);
		} else {
			if (!this.canBroadcast()) return;
			if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
			if (tour[room.id] == undefined) return this.sendReply('No hay un torneo activo en una sala.');
			if (tour[room.id].status < 2) return this.sendReply('No hay torneos fuera de la fase de inscripcion.');
			var html = '<hr /><h3><font color="green">Ronda '+ tour[room.id].roundNum + '!</font></h3><font color="blue"><b>FORMATO:</b></font> ' + Tools.data.Formats[tour[room.id].tier].name + "<hr /><center><small><font color=red>Rojo</font> = descalificado, <font color=\"green\">Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small><center><br />";
			var r = tour[room.id].round;
			var firstMatch = false;
			for (var i in r) {
				if (!r[i][1]) {
					//bye
					var byer = tour.username(r[i][0]);
					html += "<font color=\"green\">" + clean(byer) + " ha pasado a la siguiente ronda.</font><br />";
				} else {
					if (r[i][2] == undefined) {
						//haven't started
						var p1n = tour.username(r[i][0]);
						var p2n = tour.username(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
						html += tabla + "<tr><td align=right>" + clean(p1n) + "</td><td>&nbsp;VS&nbsp;</td><td>" + clean(p2n) + "</td></tr>";
					} else if (r[i][2] == -1) {
						//currently battling
						var p1n = tour.username(r[i][0]);
						var p2n = tour.username(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = "";if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>";firstMatch = true;}
						var tourbattle = tour[room.id].battles[i];
						function link(txt) {return "<a href='/" + tourbattle + "' room='" + tourbattle + "' class='ilink'>" + txt + "</a>";}
						html += tabla + "<tr><td align=right><b>" + link(clean(p1n)) + "</b></td><td><b>&nbsp;" + link("VS") + "&nbsp;</b></td><td><b>" + link(clean(p2n)) + "</b></td></tr>";
					} else {
						//match completed
						var p1 = "red"; var p2 = "green";
						if (r[i][2] == r[i][0]) {
							p1 = "green"; p2 = "red";
						}
						var p1n = tour.username(r[i][0]);
						var p2n = tour.username(r[i][1]);
						if (p1n.substr(0, 6) === 'Guest ') p1n = r[i][0];
						if (p2n.substr(0, 6) === 'Guest ') p2n = r[i][1];
						var tabla = ""; if (!firstMatch) {var tabla = "</center><table align=center cellpadding=0 cellspacing=0>"; firstMatch = true;}
						html += tabla + "<tr><td align=right><b><font color=\"" + p1 + "\">" + clean(p1n) + "</font></b></td><td><b>&nbsp;VS&nbsp;</b></td><td><font color=\"" + p2 + "\"><b>" + clean(p2n) + "</b></font></td></tr>";
					}
				}
			}
			this.sendReply("|raw|" + html + "</table><hr />");
		}
	},

	disqualify: 'dq',
	dq: function(target, room, user, connection) {
		if (War.getTourData(room.id)) return this.parse("/war dq, " + target);
		if (teamTour.getTourData(room.id))return this.parse("/tt dq, " + target);
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (!target) return this.sendReply('El comando correcto es: /dq usuario');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined) return this.sendReply('No hay un torneo activo en esta sala.');
		if (tour[room.id].status < 2) return this.sendReply('No hay un torneo fuera de la fase de inscripcion.');
		if (Config.tourDqGuard) {
			var stop = false;
			for (var x in tour[room.id].round) {
				if (tour[room.id].round[x][2] === -1) {
					stop = true;
					break;
				}
			}
			if (stop) return this.sendReply('Debido a la configuracion actual, no es posible descalificar jugadores mientras haya batallas en curso.');
		}
		var targetUser = Users.get(target);
		if (!targetUser) {
			var dqGuy = Tools.escapeHTML(target.toLowerCase());
		} else {
			var dqGuy = toId(target);
		}
		var error = tour.lose(dqGuy, room.id);
		if (error == -1) {
			return this.sendReply('El Usuario \'' + target + '\' no estaba en el torneo.');
		} else if (error == 0) {
			return this.sendReply('El Usuario \'' + target + '\' no tenia un oponente asignado. Espera hasta la siguiente ronda antes de descalificarlo.');
		} else if (error == 1) {
			return this.sendReply('El Usuario \'' + target + '\' ya paso a la siguiente ronda. Espera hasta la siguiente antes de descalificarlo.');
		} else {
			room.addRaw('<b>' + tour.username(dqGuy) + '</b> fue descalificado por ' + user.name + ' asi que ' + tour.username(error) + ' pasa a la siguiente ronda.');
			var r = tour[room.id].round;
			var c = 0;
			for (var i in r) {
				if (r[i][2] && r[i][2] != -1) c++;
			}
			if (r.length == c) tour.nextRound(room.id);
		}
	},

	replace: function(target, room, user, connection) {
		if (War.getTourData(room.id)) return this.parse("/war replace, " + target);
		if (teamTour.getTourData(room.id))return this.parse("/tt replace, " + target);
		if (!tour.midauth(user,room)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (room.decision) return this.sendReply('Prof. Oak: No es un buen momento para usar este comando. No puedes utilizarlo en salas de batalla.');
		if (tour[room.id] == undefined || tour[room.id].status != 2) return this.sendReply('No hay un torneo aca o esta en su fase de inscripcion. Reemplazar participantes solo es posible en la mitad del torneo.');
		if (tour[room.id].roundNum > 1 && !Config.tourUnlimitReplace) return this.sendReply('Debido a la configuracion actual, reemplazar participantes solo esta permitido en la primera ronda de un torneo.');
		if (!target) return this.sendReply('El comando correcto es: /replace reemplazado, sustituto.');
		var t = tour.splint(target);
		if (!t[1]) return this.sendReply('El comando correcto es: /replace reemplazado, sustituto.');
		var userOne = Users.get(t[0]);
		var userTwo = Users.get(t[1]);
		if (!userTwo) {
			return this.sendReply('El comando correcto es: /replace reemplazado, sustituto. El usuario especificado como reemplazado no esta presente.');
		} else {
			t[1] = toId(t[1]);
		}
		if (userOne) {
			t[0] = toId(t[0]);
		}
		var rt = tour[room.id];
		var init1 = false;
		var init2 = false;
		var players = rt.players;
		//check if replacee in tour
		for (var i in players) {
			if (players[i] ==  t[0]) {
				init1 = true;
				break;
			}
		}
		//check if replacer in tour
		for (var i in players) {
			if (players[i] ==  t[1]) {
				init2 = true;
				break;
			}
		}
		if (!init1) return this.sendReply(tour.username(t[0])  + ' no puede ser reemplazado por ' + tour.username(t[1]) + " porque no esta en el torneo.");
		if (init2) return this.sendReply(tour.username(t[1]) + ' no puede reemplazar a ' + tour.username(t[0]) + ' porque ya esta en el torneo.');
		var outof = ["players", "winners", "losers", "round"];
		for (var x in outof) {
			for (var y in rt[outof[x]]) {
				var c = rt[outof[x]][y];
				if (outof[x] == "round") {
					if (c[0] == t[0]) c[0] = t[1];
					if (c[1] == t[0]) c[1] = t[1];
					if (c[2] == t[0]) c[2] = t[1];
				}
				else {
					if (c == t[0]) rt[outof[x]][y] = t[1];
				}
			}
		}
		rt.players.splice(rt.players.indexOf(t[0]), 1);
		rt.players.push(t[1]);
		rt.history.push(t[0] + "->" + t[1]);
		room.addRaw(user.name + ': <b>' + tour.username(t[0]) +'</b> es sustituido por <b>' + tour.username(t[1]) + '</b>.');
	},

	tours: function(target, room, user, connection) {
		if (!this.canBroadcast()) return;
		var oghtml = "<hr /><h2>Torneos en su fase de entrada:</h2>";
		var html = oghtml;
		for (var i in tour) {
			var c = tour[i];
			if (typeof c == "object") {
				if (c.status == 1) html += '<button name="joinRoom" value="' + i + '">' + Rooms.rooms[i].title + ' - ' + Tools.data.Formats[c.tier].name + '</button> ';
			}
		}
		if (html == oghtml) html += "No hay torneos en su fase de entrada.";
		this.sendReply('|raw|' + html + "<hr />");
	},

	invalidate: function(target,room,user) {
		if (!room.decision) return this.sendReply('Solo puedes hacer esto en una sala de batalla.');
		if (!room.tournament) return this.sendReply('Esta no es una batalla oficial de torneo.');
		if (!tour.highauth(user)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		tourinvalidlabel:
		{
			for (var i in tour) {
				var c = tour[i];
				if (c.status == 2) {
					for (var x in c.round) {
						if (c.round[x] === undefined) continue;
						if ((room.p1.userid == c.round[x][0] && room.p2.userid == c.round[x][1]) || (room.p2.userid == c.round[x][0] && room.p1.userid == c.round[x][1])) {
							if (c.round[x][2] == -1) {
								c.round[x][2] = undefined;
								Rooms.rooms[i].addRaw("La batalla entre " + '<b>' + room.p1.name + '</b>' + " y " + '<b>' + room.p2.name + '</b>' + " ha sido " + '<b>' + "invalidada." + '</b>');
								tour[i].battlesinvtie.push(room.id);
								break tourinvalidlabel;
							}
						}
					}
				}
			}
		}
	},

	tourbats: function(target, room, user) {
		if (!tour[room.id].status) return this.sendReply('No hay un torneo activo en esta sala.');
		if (target == 'all') {
			if (tour[room.id].battlesended.length == 0) return this.sendReply('No se ha registrado batallas finalizadas en este torneo.');
			var msg = new Array();
			for (var i=0; i<tour[room.id].battlesended.length; i++) {
				msg[i] = "<a href='/" + tour[room.id].battlesended[i] + "' class='ilink'>" + tour[room.id].battlesended[i].match(/\d+$/) + "</a>";
			}
			return this.sendReplyBox(msg.toString());
		} else if (target == 'invtie') {
			if (tour[room.id].battlesinvtie.length == 0) return this.sendReply('No se ha registrado empates ni invalidaciones de batallas en este torneo.');
			var msg = new Array();
			for (var i=0; i<tour[room.id].battlesinvtie.length; i++) {
				msg[i] = "<a href='/" + tour[room.id].battlesinvtie[i] + "' class='ilink'>" + tour[room.id].battlesinvtie[i].match(/\d+$/) + "</a>";
			}
			return this.sendReplyBox(msg.toString());
		} else {
			return this.sendReply('Utilice "/tourbats all" o "/tourbats invtie"');
		}
	},

	toursettings: function(target, room, user) {
		if (!tour.maxauth(user)) return this.sendReply('No tienes suficiente poder para utilizar este comando.');
		if (target === 'replace on') return Config.tourUnlimitReplace = true;
		if (target === 'replace off') return Config.tourUnlimitReplace = false;
		if (target === 'alts on') return Config.tourAllowAlts = true;
		if (target === 'alts off') return Config.tourAllowAlts = false;
		if (target === 'dq on') return Config.tourDqGuard = false;
		if (target === 'dq off') return Config.tourDqGuard = true;
		if ((target.substr(0,6) === 'margin') && !isNaN(parseInt(target.substr(7))) && parseInt(target.substr(7)) >= 0) return Config.tourTimeMargin = parseInt(target.substr(7));
		if ((target.substr(0,6) === 'period') && !isNaN(parseInt(target.substr(7))) && parseInt(target.substr(7)) > 0) return Config.tourTimePeriod = parseInt(target.substr(7));
		if (target === 'view' || target === 'show' || target === 'display') {
			var msg = '';
			msg = msg + 'Es posible reemplazar participantes luego de la primera ronda? ' + new Boolean(Config.tourUnlimitReplace) + '.<br>';
			msg = msg + 'Puede un jugador participar en un torneo con varias cuentas? ' + new Boolean(Config.tourAllowAlts) + '.<br>';
			msg = msg + 'Es posible descalificar participantes si hay batallas en curso? ' + (!Config.tourDqGuard) + '.<br>';
			msg = msg + 'En torneos con fase de registro cronometrada, el registro de jugadores se anuncia indidualmente hasta que ' + (!isNaN(Config.tourTimeMargin) ? Config.tourTimeMargin : 3) + ' se hayan unido.<br>';
			msg = msg + 'En torneos con fase de registro cronometrada, el registro de jugadores se anuncia en grupos de ' + (Config.tourTimePeriod ? Config.tourTimePeriod : 4) + ' participantes.';
			return this.sendReplyBox(msg);
		}
		return this.sendReply('Son argumentos validos para este comando: view, replace on/off, alts on/off, invalidate on/off, dq on/off, lowauth/midauth/highauth SIMBOLO, margin NUMERO, period NUMERO');
	},

		/*
	tourdoc: function() {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Click <a href='http://elloworld.dyndns.org/documentation.html'>here</a> to be taken to the documentation for the tournament commands.");
	},
		*/


	/* Team tour commands */

	cwar: 'teamtour',
	customwar: 'teamtour',
	tt: 'teamtour',
	teamtour: function(target, room, user, connection) {
		var roomId = room.id;
		var params;
		if (!target) {
			params = ['round'];
		} else {
			params = target.split(',');
		}
		switch (toId(params[0])) {
			case 'buscar':
			case 'search':
				if (!this.canBroadcast()) return false;
				this.sendReplyBox(teamTour.getTours());
				break;
			case 'help':
				if (!this.canBroadcast()) return false;
				this.sendReplyBox(
					'<font size = 2>Torneos de Equipos</font><br />' +
					'Se trata de un sistema de Torneos en el que un equipo se enfrenta contra otro, al estilo de las guerras de clanes. Este sistema está disponible para todas las salas y es moderable por los rangos %, @, #, & y ~.<br />' +
					'Los comandos están compactados en /teamtour o /tt y son los siguientes:<br />' +
					'<ul><li>/teamtour new, [standard/total/lineups], [tier/multitier], [tamaño], [equipoA], [equipoB] - Crea un torneo de equipos.</li>' +
					'<li>/teamtour end - finaliza un torneo de equipos.</li>' +
					'<li>/teamtour join, [equipo] - Comando para unirse al torneo de equipos.</li>' +
					'<li>/teamtour leave - Comando para salir del torneo.</li>' +
					'<li>/teamtour o /tt - Muestra el estado del torneo de equipos.</li>' +
					'<li>/teamtour dq, [usuario] - Comando para descalificar.</li>' +
					'<li>/teamtour replace, [usuario1], [usuario2] - Comando para reemplazar.</li>' +
					'<li>/teamtour invalidate, [participante] - Comando para invalidar una batalla o un resultado.</li>' +
					'<li>/teamtour size, [Jugadores por team] - Cambia el tamaño del torneo.</li>' +
					'<li>/teamtour auth, [Capitan1], [Capitan2] - Establece los capitanes de los equipos en un torneo por alineaciones.</li>' +
					'<li>/teamtour reg, [P1], [P2]... - Comando para registrar alineaciones, solo usable por los capitanes.</li>' +
					'<li>/teamtour start - Inicia un torneo una vez registradas las alineaciones.</li>' +
					'<li>/teamtour search - Muestra los torneos de Equipos abiertos en el servidor.</li>' +
					'</ul>');
				break;
			case 'nuevo':
			case 'new':
			case 'create':
				if (params.length < 6) return this.sendReply("Usage: /teamtour new, [standard/total/lineups], [tier/multitier], [tamaño], [equipoA], [equipoB]");
				if (!this.can('tournaments', room)) return false;
				if (teamTour.getTourData(roomId)) return this.sendReply("Ya había un torneo de equipos en esta sala.");
				if (War.getTourData(roomId)) return this.sendReply("Ya había una guerra en esta sala.");
				if (tour[roomId] && tour[roomId].status != 0) return this.sendReply('Ya hay un torneo en curso.');
				var size = parseInt(params[3]);
				if (size < 2) return this.sendReply("Mínimo deben ser 3 jugadores por equipo.");
				var format = teamTour.tourTiers[toId(params[2])];
				if (!format) return this.sendReply("Formato no válido.");
				switch (toId(params[1])) {
					case 'standard':
						teamTour.newTeamTour(room.id, 'standard', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]));
						this.logModCommand(user.name + " ha iniciado torneo standard entre los equipos " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado un Torneo de Equipos Standard en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2> <button name="send" value="/tt join, ' + Tools.escapeHTML(params[4]) + '">Jugar con ' + Tools.escapeHTML(params[4]) + '</button>&nbsp;<button name="send" value="/tt join, ' + Tools.escapeHTML(params[5]) + '">Jugar con ' + Tools.escapeHTML(params[5]) + '</button><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración del torneo.</b></font>');
						break;
					case 'total':
						teamTour.newTeamTour(room.id, 'total', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]));
						this.logModCommand(user.name + " ha iniciado torneo total entre los equipos " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado un Torneo de Equipos Total en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2> <button name="send" value="/tt join, ' + Tools.escapeHTML(params[4]) + '">Jugar con ' + Tools.escapeHTML(params[4]) + '</button>&nbsp;<button name="send" value="/tt join, ' + Tools.escapeHTML(params[5]) + '">Jugar con ' + Tools.escapeHTML(params[5]) + '</button><br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración del torneo.</b></font>');
						break;
					case 'lineups':
						if (params.length < 8) return this.sendReply("Usage: /teamtour new, lineups, [tier/multitier], [tamano], [equipoA], [equipoB], [capitan1], [capitan2]");
						var userCapA = Users.getExact(params[6]);
						if (!userCapA) return this.sendReply("El usuario " + Tools.escapeHTML(params[6]) + " no está disponible.");
						var userCapB = Users.getExact(params[7]);
						if (!userCapB) return this.sendReply("El usuario " + Tools.escapeHTML(params[7]) + " no está disponible.");
						teamTour.newTeamTour(room.id, 'lineups', format, size, Tools.escapeHTML(params[4]), Tools.escapeHTML(params[5]), userCapA.name, userCapB.name);
						this.logModCommand(user.name + " ha iniciado torneo con alineaciones entre los equipos " + toId(params[4]) + " y " + toId(params[5]) + " en formato " + format + ".");
						Rooms.rooms[room.id].addRaw('<hr /><h2><font color="green">' + user.name + ' ha iniciado un Torneo de Equipos con Alineaciones en formato ' + format + ' entre ' + Tools.escapeHTML(params[4]) + " y " + Tools.escapeHTML(params[5]) +  '.</font></h2><b><font color="orange">Capitanes de equipo: </font>' + userCapA.name + ' y ' + userCapB.name + '</font></b> <br /><b><font color="blueviolet">Jugadores por equipo:</font></b> ' + size + '<br /><font color="blue"><b>FORMATO:</b></font> ' + format + '<hr /><br /><font color="red"><b>Recuerda que debes mantener tu nombre durante toda la duración del torneo. <br />Los capitales deben usar /tt reg, [miembro1], [miembro2]... para registrar las alineaciones.</b></font>');
						break;
					default:
						return this.sendReply("El tipo de tour debe ser uno de estos: [standard/total/lineups]");
				}
				break;
			case 'end':
			case 'fin':
			case 'delete':
				if (!this.can('tournaments', room)) return false;
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala");
				this.logModCommand(user.name + " ha cancelado el torneo de equipos entre " + toId(tourData.teamA) + " y " + toId(tourData.teamB) + ".");
				Rooms.rooms[room.id].addRaw('<hr /><center><h2><font color="green">' + user.name + ' ha cancelado el torneo entre ' + tourData.teamA + " y " + tourData.teamB + '.</h2></font></center><hr />');
				teamTour.endTeamTour(roomId);
				break;
			case 'j':
			case 'unirse':
			case 'join':
				if (params.length < 2) return this.sendReply("Usage: /teamtour join, [team]");
				var err = teamTour.joinTeamTour(roomId, user.name, params[1]);
				if (err) return this.sendReply(err);
				var tourData = teamTour.getTourData(roomId);
				var teamJoining = tourData.teamA.trim();
				if (toId(params[1]) === toId(tourData.teamB)) teamJoining = tourData.teamB.trim();
				var freePlaces =  teamTour.getFreePlaces(roomId); 
				if (freePlaces > 0) {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido al torneo por equipos (' + teamJoining + '). Quedan ' + freePlaces + ' plazas.');
				} else {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido al torneo por equipos (' + teamJoining + '). Comienza el Torneo!');
					teamTour.startTeamTour(roomId);
					Rooms.rooms[room.id].addRaw(teamTour.viewTourStatus(roomId));
				}
				break;
			case 'l':
			case 'salir':
			case 'leave':
				var err = teamTour.leaveTeamTour(roomId, user.name);
				if (err) return this.sendReply(err);
				var freePlaces =  teamTour.getFreePlaces(roomId);
				Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha salido del torneo por equipos. Quedan ' + freePlaces + ' plazas.');
				break;
			case 'auth':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 3) return this.sendReply("Usage: /teamtour auth, [Capitan1], [Capitan2]");
				var userCapA = Users.getExact(params[1]);
				if (!userCapA) return this.sendReply("El usuario " + Tools.escapeHTML(params[6]) + " no está disponible.");
				var userCapB = Users.getExact(params[2]);
				if (!userCapB) return this.sendReply("El usuario " + Tools.escapeHTML(params[7]) + " no está disponible.");
				var err = teamTour.setAuth(roomId, params[1], params[2]);
				if (err) return this.sendReply(err);
				this.privateModCommand('(' + user.name + ' ha cambiado los Capitanes del torneo de Equipos.)');
				break;
			case 'lineup':
			case 'alineacion':
			case 'registrar':
			case 'reg':
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala");
				if (toId(user.name) !== toId(tourData.authA) && toId(user.name) !== toId(tourData.authB)) return this.sendReply("Debes ser Capitan de uno de los dos equipos para hacer esto.");
				var err = teamTour.regParticipants(roomId, user.name, target);
				if (err) return this.sendReply(err);
				if (toId(user.name) === toId(tourData.authA)) Rooms.rooms[room.id].addRaw(user.name + ' ha registrado la alinación para ' + tourData.teamA + '.');
				if (toId(user.name) === toId(tourData.authB)) Rooms.rooms[room.id].addRaw(user.name + ' ha registrado la alinación para ' + tourData.teamB + '.');
				break;
			case 'empezar':
			case 'begin':
			case 'start':
				if (!this.can('tournaments', room)) return false;
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala.");
				if (tourData.tourRound !== 0) return this.sendReply("El torneo ya había empezado.");

				var freePlaces =  teamTour.getFreePlaces(roomId);
				if (freePlaces > 0) return this.sendReply("Aún quedan plazas libres.");
				teamTour.startTeamTour(roomId);
				Rooms.rooms[room.id].addRaw(teamTour.viewTourStatus(roomId));
				break;
			case 'size':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /teamtour size, [size]");
				var err = teamTour.sizeTeamTour(roomId, params[1]);
				if (err) return this.sendReply(err);
				var freePlaces =  teamTour.getFreePlaces(roomId);
				if (freePlaces > 0) {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha cambiado el tama&ntilde;o del torneo a ' + parseInt(params[1]) + '. Quedan ' + freePlaces + ' plazas.');
				} else {
					Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha cambiado el tama&ntilde;o del torneo a ' + parseInt(params[1]) + '. Comienza el Torneo!');
					teamTour.startTeamTour(roomId);
					Rooms.rooms[room.id].addRaw(teamTour.viewTourStatus(roomId));
				}
				break;
			case 'disqualify':
			case 'dq':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /teamtour dq, [user]");
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala");
				if (!teamTour.dqTeamTour(roomId, params[1], 'cmd')) return this.sendReply("No se pudo descalificar al usuario.");
				var userk = Users.getExact(params[1]);
				if (userk) userk = userk.name; else userk = toId(params[1]);
				this.addModCommand(userk + ' fue descalificado del torneo de equipos por ' + user.name + '.');
				if (teamTour.isRoundEnded(roomId)) {
					teamTour.autoEnd(roomId);
				}
				break;
			case 'replace':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 3) return this.sendReply("Usage: /teamtour replace, [userA], [userB]");
				var usera = Users.getExact(params[1]);
				if (usera) usera = usera.name; else usera = toId(params[1]);
				var userb = Users.getExact(params[2]);
				if (userb) {
					userb = userb.name;
				} else {
					return this.sendReply("El usuario por el que reemplazas debe estár conectado.");
				}
				var err = teamTour.replaceParticipant(roomId, params[1], params[2]);
				if (err) return this.sendReply(err);
				this.addModCommand(user.name + ': ' + usera + ' es reemplazado por ' + userb + ' en el Torneo de equipos.');
				break;
			case 'invalidate':
				if (!this.can('tournamentsmoderation', room)) return false;
				if (params.length < 2) return this.sendReply("Usage: /teamtour invalidate, [user]");
				var tourData = teamTour.getTourData(roomId);
				if (!tourData) return this.sendReply("No había ningún torneo de equipos en esta sala");
				var matchupId = teamTour.findMatchup(roomId, params[1]);
				if (!teamTour.invalidate(roomId, matchupId)) return this.sendReply("No se pudo invalidar el resultado. Puede que aún no se haya establecido ningún resultado.");
				this.addModCommand('La batalla entre ' + tourData.matchups[matchupId].from + ' y ' + tourData.matchups[matchupId].to + ' fue invalidada por ' + user.name + '.');
				break;
			case 'hotpatch':
				if (!this.can('hotpatch')) return false;
				CommandParser.uncacheTree('./teamtour.js');
				teamTour = require('./teamtour.js');
				return this.sendReply('Team tours hotpatched.');
			case 'ronda':
			case 'round':
				if (!this.canBroadcast()) return false;
				return this.sendReply('|raw|' + teamTour.viewTourStatus(roomId));
			default:
				this.sendReply('No se reconoce el comando. Quizás te pueda ayuadar /teamtour help.');
		}
	}
};
