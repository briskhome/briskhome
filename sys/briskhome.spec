Name: briskhome
Version: %{version}
Release: 1
Summary: Briskhome is a work-in-progress extensible open-source house monitoring and automation system.
License: No


AutoReqProv: no
BuildRequires: nodejs = 2:8.1.2
Requires: nodejs = 2:8.1.2


%description
Warp Profi.ru package.
Simplifies data access services.
Provides GraphQL API.
Generates some profi.ru pages.
GIT INFO: %{GITCOMMIT}

%build
# Cache node_modules dev
mkdir -p %{_builddir}/warp-modules-dev
cp $WORKSPACE/package.json %{_builddir}/warp-modules-dev/
cp $WORKSPACE/yarn.lock %{_builddir}/warp-modules-dev/
cd %{_builddir}/warp-modules-dev
# Some dependencies are wrongly reused if we are not cleaning workspace
rm -rf node_modules
yarn --no-emoji --ignore-engines --frozen-lockfile

# Cache node_modules production
mkdir -p %{_builddir}/warp-modules-production
cp $WORKSPACE/package.json %{_builddir}/warp-modules-production/
cp $WORKSPACE/yarn.lock %{_builddir}/warp-modules-production/
cd %{_builddir}/warp-modules-production
# Some dependencies are wrongly reused if we are not cleaning workspace
rm -rf node_modules
yarn --no-emoji --ignore-engines --production --frozen-lockfile

# Build
rm -rf %{_builddir}/warp-build
cp -r $WORKSPACE %{_builddir}/warp-build
rm -rf %{_builddir}/warp-build/build
rm -rf %{_builddir}/warp-build/node_modules
cp -r %{_builddir}/warp-modules-dev/node_modules %{_builddir}/warp-build/
cd %{_builddir}/warp-build
export NODE_ENV='production'
yarn build

%install
mkdir -p %{buildroot}/opt

# /opt/warp - files from git + production node_modules + builded source + builded public
cp -r $WORKSPACE %{buildroot}/opt/warp
cp -r %{_builddir}/warp-build/build %{buildroot}/opt/warp
cp -r %{_builddir}/warp-build/public %{buildroot}/opt/warp
cp -r %{_builddir}/warp-modules-production/node_modules %{buildroot}/opt/warp

# configs that don't overwrite default configs
mkdir -p %{buildroot}%{_sysconfdir}/haproxy
cp "$WORKSPACE/sys/haproxy/warp.cfg" %{buildroot}%{_sysconfdir}/haproxy
cp "$WORKSPACE/sys/haproxy/warp-pxchat.cfg" %{buildroot}%{_sysconfdir}/haproxy
mkdir -p %{buildroot}%{_sysconfdir}/nginx/conf.d
cp "$WORKSPACE/sys/nginx/conf.d/warp.conf" %{buildroot}%{_sysconfdir}/nginx/conf.d
cp "$WORKSPACE/sys/nginx/conf.d/profi.conf" %{buildroot}%{_sysconfdir}/nginx/conf.d
cp "$WORKSPACE/sys/nginx/conf.d/nginx-stats.conf" %{buildroot}%{_sysconfdir}/nginx/conf.d
mkdir -p %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp@.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-online-status-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-unlock-order-offline-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-unlock-order-timeout-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-invite-nkprep-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-join-ordercomments-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-chatsendemsm-tracker@.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-chatsendemsm4k-tracker@.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-chattoslack-tracker@.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-notify-unshownmessages-tracker@.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-join-client-order-klientize-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-notify-orderchanged-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-unjoin-prepfromchat-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-nk-removeblock-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-nk-zayavka-notify.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-singleton-sbr-tick-tracker.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-cron-daily.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-haproxy.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-pxchat-haproxy.service" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-web.target" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-web-dev.target" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-pxchat.target" %{buildroot}%{_sysconfdir}/systemd/system
cp "$WORKSPACE/sys/systemd/system/warp-pxchat-dev.target" %{buildroot}%{_sysconfdir}/systemd/system
install -p -D -m 0644 "$WORKSPACE/sys/tmpfiles.d/warp.conf" %{buildroot}%{_sysconfdir}/tmpfiles.d/warp.conf

%clean
rm -rf %{_builddir}/warp-build
rm -rf %{buildroot}


%pre
# create warp user if not exists
if ! id -u warp > /dev/null 2>&1; then
  useradd -m warp
fi


%post
# overwrite default nginx config
cp --remove-destination /opt/warp/sys/nginx/nginx.conf %{_sysconfdir}/nginx/nginx.conf
rm -f /opt/warp/.roadrunner.json

# create ri_events tracker file for runner
mkdir -p /var/lib/warp/amqp/cursors
touch /var/lib/warp/amqp/cursors/ri_events.txt
chown warp:warp /var/lib/warp/amqp/cursors/ri_events.txt
mkdir -p /var/lib/warp/trackers/InvitePrepOnOrderNkUtochn
touch /var/lib/warp/trackers/InvitePrepOnOrderNkUtochn/last_o_utochn.txt
chown warp:warp /var/lib/warp/trackers/InvitePrepOnOrderNkUtochn/last_o_utochn.txt
mkdir -p /var/lib/warp/trackers/InvitePrepOnOrderNkDublikat
touch /var/lib/warp/trackers/InvitePrepOnOrderNkDublikat/last_o_dublikat.txt
chown warp:warp /var/lib/warp/trackers/InvitePrepOnOrderNkDublikat/last_o_dublikat.txt
mkdir -p /var/lib/warp/trackers/ChatSendEMSMEventTracker
touch /var/lib/warp/trackers/ChatSendEMSMEventTracker/last_message_id.txt
chown warp:warp /var/lib/warp/trackers/ChatSendEMSMEventTracker/last_message_id.txt
mkdir -p /var/lib/warp/trackers/ChatSendEMSM4KEventTracker
touch /var/lib/warp/trackers/ChatSendEMSM4KEventTracker/last_message_id.txt
chown warp:warp /var/lib/warp/trackers/ChatSendEMSM4KEventTracker/last_message_id.txt
mkdir -p /var/lib/warp/trackers/NotifyCountEventTracker
touch /var/lib/warp/trackers/NotifyCountEventTracker/last_message_id.txt
chown warp:warp /var/lib/warp/trackers/NotifyCountEventTracker/last_message_id.txt
mkdir -p /var/lib/warp/trackers/JoinClientToChatOnKlientize
touch /var/lib/warp/trackers/JoinClientToChatOnKlientize/last_event_id.txt
chown warp:warp /var/lib/warp/trackers/JoinClientToChatOnKlientize/last_event_id.txt
mkdir -p /var/lib/warp/trackers/NotifyChatOnChangeOrder
touch /var/lib/warp/trackers/NotifyChatOnChangeOrder/last_event_id.txt
chown warp:warp /var/lib/warp/trackers/NotifyChatOnChangeOrder/last_event_id.txt
mkdir -p /var/lib/warp/trackers/UnjoinPrepFromChatOnOrderRefuzed
touch /var/lib/warp/trackers/UnjoinPrepFromChatOnOrderRefuzed/last_event_id.txt
chown warp:warp /var/lib/warp/trackers/UnjoinPrepFromChatOnOrderRefuzed/last_event_id.txt
/usr/bin/systemd-tmpfiles --create


%files
%defattr(-, warp, warp, -)
/opt/warp
%config %{_sysconfdir}/nginx/conf.d/nginx-stats.conf
%config %{_sysconfdir}/nginx/conf.d/warp.conf
%config %{_sysconfdir}/nginx/conf.d/profi.conf
%config %{_sysconfdir}/haproxy/warp.cfg
%config %{_sysconfdir}/haproxy/warp-pxchat.cfg
%config %{_sysconfdir}/systemd/system/warp@.service
%config %{_sysconfdir}/systemd/system/warp-haproxy.service
%config %{_sysconfdir}/systemd/system/warp-pxchat-haproxy.service
%config %{_sysconfdir}/systemd/system/warp-singleton.service
%config %{_sysconfdir}/systemd/system/warp-singleton-online-status-tracker.service
%config %{_sysconfdir}/systemd/system/warp-singleton-unlock-order-offline-tracker.service
%config %{_sysconfdir}/systemd/system/warp-singleton-unlock-order-timeout-tracker.service
%config %{_sysconfdir}/systemd/system/warp-singleton-invite-nkprep-tracker.service
%config %{_sysconfdir}/systemd/system/warp-singleton-join-ordercomments-tracker.service
%config %{_sysconfdir}/systemd/system/warp-singleton-chatsendemsm-tracker@.service
%config %{_sysconfdir}/systemd/system/warp-singleton-chatsendemsm4k-tracker@.service
%config %{_sysconfdir}/systemd/system/warp-singleton-chattoslack-tracker@.service
%config %{_sysconfdir}/systemd/system/warp-singleton-notify-unshownmessages-tracker@.service
%config %{_sysconfdir}/systemd/system/warp-singleton-join-client-order-klientize-tracker.service
%config %{_sysconfdir}/systemd/system/warp-singleton-notify-orderchanged-tracker.service
%config %{_sysconfdir}/systemd/system/warp-singleton-unjoin-prepfromchat-tracker.service
%config %{_sysconfdir}/systemd/system/warp-singleton-nk-removeblock-tracker.service
%config %{_sysconfdir}/systemd/system/warp-singleton-nk-zayavka-notify.service
%config %{_sysconfdir}/systemd/system/warp-singleton-sbr-tick-tracker.service
%config %{_sysconfdir}/systemd/system/warp-cron-daily.service
%config %{_sysconfdir}/systemd/system/warp-web.target
%config %{_sysconfdir}/systemd/system/warp-web-dev.target
%config %{_sysconfdir}/systemd/system/warp-pxchat.target
%config %{_sysconfdir}/systemd/system/warp-pxchat-dev.target
%config %{_sysconfdir}/tmpfiles.d/warp.conf