'use strict';
'require form';
'require network';
'require uci';
'require view';

return view.extend({
	load: function() {
		return Promise.all([
			uci.load('trusted_devices'),
			network.getHostHints()
		]);
	},

	render: function(data) {
		var hints = (data[1] && data[1].hosts) || {};
		var m, s, o, hl, k, i, mac, ip;

		m = new form.Map('trusted_devices', _('Trusted Devices'),
			_('Devices in the whitelist can open LuCI without entering a password and are logged in automatically. All other devices still have to log in normally.'));

		s = m.section(form.NamedSection, 'main', 'trusted_devices', _('Settings'));
		s.anonymous = true;

		o = s.option(form.Flag, 'enabled', _('Enable'));
		o.default = o.disabled;
		o.rmempty = false;

		o = s.option(form.Value, 'user', _('Login account'),
			_('System account used for the passwordless login, defaults to luci-trusted and usually does not need to be changed.'));
		o.default = 'luci-trusted';
		o.rmempty = false;

		s = m.section(form.TableSection, 'device', _('Trusted devices'));
		s.addremove = true;
		s.anonymous = true;
		s.sortable = true;

		o = s.option(form.Value, 'name', _('Name'),
			_('Remark only, may be left empty.'));

		o = s.option(form.Value, 'mac', _('MAC address'),
			_('Enter the device MAC address, or pick a currently online device from the list.'));
		o.datatype = 'macaddr';
		o.rmempty = false;

		for (k in hints) {
			hl = hints[k];

			for (i = 0; hl.macaddrs && i < hl.macaddrs.length; i++) {
				mac = hl.macaddrs[i];

				if (!mac)
					continue;

				ip = (hl.ipaddrs && hl.ipaddrs[0]) || '';

				o.value(mac, hl.name
					? String.format('%s (%s)', hl.name, mac)
					: (ip ? String.format('%s (%s)', mac, ip) : mac));
			}
		}

		return m.render();
	}
});
