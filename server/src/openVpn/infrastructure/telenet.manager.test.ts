import {TelnetManager} from './telnet.manager';
import {Test} from '@nestjs/testing';
import {EventEmitter2} from '@nestjs/event-emitter';
import {ShutdownService} from 'lifecycle';
import {Client} from 'openVpn/domain/client.entity';

describe('TelnetManager', () => {
  let telnetManager: TelnetManager;
  let mockShutdownService: Partial<ShutdownService>;
  let mockEventEmitter: Partial<EventEmitter2>;

  beforeEach(async () => {
    mockShutdownService = {
      shutdown: jest.fn(),
    };

    mockEventEmitter = {
      emit: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [TelnetManager, ShutdownService, EventEmitter2],
    })
      .overrideProvider(ShutdownService)
      .useValue(mockShutdownService)
      .overrideProvider(EventEmitter2)
      .useValue(mockEventEmitter)
      .compile();

    telnetManager = moduleRef.get<TelnetManager>(TelnetManager);
  });

  describe('onData', () => {
    it('should parse ByteCount messages in a single chunk', () => {
      const message = '>BYTECOUNT:123,456\n';

      telnetManager['onData'](Buffer.from(message));

      expect(mockEventEmitter.emit).toHaveBeenCalledWith('bytecount', {
        bytesIn: 123,
        bytesOut: 456,
      });
    });

    it('should parse client connection messages in multiple chunks', async () => {
      const message1 = `>CLIENT:CONNECT,0,1
      >CLIENT:ENV,n_clients=0
      >CLIENT:ENV,password=
      >CLIENT:ENV,untrusted_port=59580
      >CLIENT:ENV,untrusted_ip=82.64.71.34
      >CLIENT:ENV,username=
      >CLIENT:ENV,IV_PLAT_VER=30_11_x86_google_goldfish_x86_sdk_gphone_x86_arm
      >CLIENT:ENV,IV_SSO=openurl,webauth,crtext
      >CLIENT:ENV,IV_GUI_VER=com.client_1.0
      >CLIENT:ENV,IV_COMP_STUBv2=1
      >CLIENT:ENV,IV_COMP_STUB=1
      >CLIENT:ENV,IV_LZO_STUB=1
      >CLIENT:ENV,IV_PROTO=22
      >CLIENT:ENV,IV_CIPHERS=AES-256-GCM:AES-128-GCM:CHACHA20-POLY1305
      >CLIENT:ENV,IV_NCP=2
      >CLIENT:ENV,IV_TCPNL=1
      >CLIENT:ENV,IV_PLAT=android
      >CLIENT:ENV,IV_VER=2.6_master
      >CLIENT:ENV,tls_serial_hex_0=09:91:53:32:22:56:34:93:90:00
      >CLIENT:ENV,tls_serial_0=45182071128322320076800
      >CLIENT:ENV,tls_digest_sha256_0=8a:89:bd:e5:34:6a:af:26:d3:b4:c0:fb:86:0e:45:be:69:a1:4f:07:e9:f5:3d:d1:a8:8f:7f:bd:4c:0e:d9:03
      >CLIENT:ENV,tls_digest_0=c2:ee:8c:4b:f6:89:78:a2:13:74:15:43:7b:fa:21:2c:e4:96:ba:1f
      `;

      const message2 = `>CLIENT:ENV,tls_id_0=CN=client:6506ee77a70089e2e9d3b700, C=FR, ST=Paris, L=Paris, O=Prowire, OU=Prowire Certificate Authority
      >CLIENT:ENV,X509_0_OU=Prowire Certificate Authority
      >CLIENT:ENV,X509_0_O=Prowire
      >CLIENT:ENV,X509_0_L=Paris
      >CLIENT:ENV,X509_0_ST=Paris
      >CLIENT:ENV,X509_0_C=FR
      >CLIENT:ENV,X509_0_CN=client:6506ee77a70089e2e9d3b700
      >CLIENT:ENV,tls_serial_hex_1=37:59:d6:c8:02:5e:1e:07:61:81:89:c5:b9:70:67:fd:c6:e7:f8:04
      >CLIENT:ENV,tls_serial_1=315997968806790321126228663082402013795515365380
      >CLIENT:ENV,tls_digest_sha256_1=a2:4d:f0:21:46:75:84:69:60:8a:28:14:5b:5b:64:03:03:8e:e3:9c:30:9e:83:36:2e:9e:b2:f1:78:8d:b7:cd
      >CLIENT:ENV,tls_digest_1=e9:81:48:e4:6c:45:63:11:44:ef:36:54:dd:80:1f:10:04:77:6f:69
      >CLIENT:ENV,tls_id_1=C=FR, ST=Ile de France, L=Paris, O=Prowire, OU=Prowire Certificate Authority, CN=Prowire Root Certificate Authority, emailAddress=contact@prowire.io
      >CLIENT:ENV,X509_1_emailAddress=contact@prowire.io
      >CLIENT:ENV,X509_1_CN=Prowire Root Certificate Authority
      >CLIENT:ENV,X509_1_OU=Prowire Certificate Authority
      >CLIENT:ENV,X509_1_O=Prowire
      >CLIENT:ENV,X509_1_L=Paris
      >CLIENT:ENV,X509_1_ST=Ile de France
      >CLIENT:ENV,X509_1_C=FR
      >CLIENT:ENV,remote_port_1=1194
      >CLIENT:ENV,local_port_1=1194
      >CLIENT:ENV,proto_1=udp
      >CLIENT:ENV,daemon_pid=22
      >CLIENT:ENV,daemon_start_time=1694958055
      >CLIENT:ENV,daemon_log_redirect=0
      >CLIENT:ENV,daemon=0
      >CLIENT:ENV,verb=1
      >CLIENT:ENV,config=/tmp/prowire--11-PuPNWV7zH1xK-.ovpn
      >CLIENT:ENV,ifconfig_local=10.8.0.1
      >CLIENT:ENV,ifconfig_netmask=255.255.255.0
      >CLIENT:ENV,script_context=init
      >CLIENT:ENV,tun_mtu=1500
      >CLIENT:ENV,dev=tun0
      >CLIENT:ENV,dev_type=tun
      >CLIENT:ENV,redirect_gateway=0
      >CLIENT:ENV,common_name=client:6506ee77a70089e2e9d3b700
      >CLIENT:ENV,END
      `;

      await telnetManager['onData'](Buffer.from(message1));
      await telnetManager['onData'](Buffer.from(message2));

      expect(mockEventEmitter.emit).toHaveBeenCalledWith('client-connect', {
        type: 'CONNECT',
        client: {
          ...new Client({cid: '0', kid: '1', userId: '6506ee77a70089e2e9d3b700'}),
          connectedAt: expect.any(Date),
        },
      });
    });
  });
});
