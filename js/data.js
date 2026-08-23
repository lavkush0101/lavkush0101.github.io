/**
 * Lavkush Jaiswal - Senior Android Framework & Automotive Systems Engineer
 * GitHub: https://github.com/lavkush0101/
 * LinkedIn: https://www.linkedin.com/in/lavkush-jaiswal-62825a130/
 */

const PORTFOLIO_DATA = {
  profile: {
    name: "Lavkush Jaiswal",
    handle: "lavkush0101",
    role: "Senior Software Engineer — Android Framework & Automotive Infotainment",
    tagline: "Building high-performance Android Auto, AOSP, AAOS, HAL/AIDL middleware, and secure embedded IVI platforms.",
    location: "Bangalore, India",
    availability: "Available for Senior / Staff Android Framework & Automotive Roles",
    email: "livelavkushjaiswal@gmail.com",
    phone: "+91-9598640101",
    github: "https://github.com/lavkush0101/",
    linkedin: "https://www.linkedin.com/in/lavkush-jaiswal-62825a130/",
    twitter: "https://github.com/lavkush0101/",
    pgpKey: "8F2C 91B4 77EA D230 4412 8A3E 90B1 CC45 61A2 7DF0",
    bio: "Senior Android Framework & Embedded Automotive Engineer with 6.9+ years of experience developing In-Vehicle Infotainment (IVI) systems, Android Auto (Wired & Wireless) projection stacks, AOSP customization, and HAL/AIDL middleware integration at Harman International. Proven expertise in SELinux policy security, MediaCodec low-latency video streaming, Binder IPC, system service architecture, and Google PCTS compliance certification.",
    stats: [
      { label: "Total Experience", value: "6.9+", suffix: "Years", detail: "AOSP, Automotive IVI & Android Framework" },
      { label: "Automotive Programs", value: "2+", suffix: "OEM Tiers", detail: "MSIL (Maruti Suzuki) & PSA (Peugeot)" },
      { label: "IVI Features Built", value: "60+", suffix: "Features", detail: "Factory Mode, CAN SW, RVC & Diagnostics" },
      { label: "Compliance & Certs", value: "100%", suffix: "Google PCTS", detail: "Android Auto Wireless & Wired Certification" },
      { label: "Projection Latency", value: "< 20ms", suffix: "Hardware", detail: "Hardware-accelerated MediaCodec pipeline" }
    ],
    telemetry: {
      target: "AOSP Android 14 / AAOS",
      status: "SYSTEM SERVER RUNNING (SELinux ENFORCING)",
      p99Latency: "16.8ms (HMI Input-to-Photon)",
      activeNodes: 32,
      clusterHealth: "100%",
      version: "AOSP-Automotive-v14.0-Harman"
    }
  },

  // Interactive Architecture Visualizer Scenarios for Automotive & Android Framework
  architectures: [
    {
      id: "ivi-diagnostic-hal",
      title: "MSIL Maruti Suzuki Diagnostic IVI & HAL Integration",
      subtitle: "System-level IVI with 60+ diagnostic features, Binder IPC & SELinux",
      description: "Custom AOSP In-Vehicle Infotainment (IVI) architecture featuring factory/dealer/engineering diagnostic modes, port-wise USB detection, Rear View Camera (RVC) remote display integration, and secure HAL/AIDL middleware.",
      metrics: {
        features: "60+ Diagnostic Tests",
        ipcLatency: "1.2 ms (Binder IPC)",
        security: "SELinux Enforcing",
        stability: "Zero Memory Leaks"
      },
      nodes: [
        {
          id: "hmi-app",
          name: "Diagnostic IVI HMI",
          type: "ingress",
          tech: "Kotlin / Java / MVVM / Android HMI",
          role: "Factory, Dealer & Engineering Mode Dashboard",
          latency: "4ms",
          details: "Multi-mode diagnostic interface controlling camera feeds, CAN bus switches, audio routing, MIC tests, and hardware peripheral diagnostics.",
          code: `// Diagnostic Mode Manager
class DiagnosticManager(private val context: Context) {
    private var iViService: IDiagnosticService? = null

    fun connectDiagnosticService() {
        val intent = Intent("com.harman.action.DIAGNOSTIC_SERVICE")
        intent.setPackage("com.harman.ivi.systemservice")
        context.bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE)
    }

    fun triggerRvcCameraFeed(enable: Boolean) {
        iViService?.setRemoteDisplayState(enable)
    }
}`
        },
        {
          id: "aidl-ipc",
          name: "AIDL & System Service",
          type: "compute",
          tech: "AIDL / Binder IPC / Custom SystemService",
          role: "Inter-Process Communication & Access Policy",
          latency: "1.2ms",
          details: "Implements AIDL interfaces for cross-process communication between unprivileged system applications and high-privilege system services running in system_server.",
          code: `// IDiagnosticService.aidl
package com.harman.ivi.systemservice;

interface IDiagnosticService {
    int getUsbPortStatus(int portIndex);
    boolean switchAudioRouting(int routingFlag);
    void setRemoteDisplayState(boolean active);
    int readCanBusSignal(String signalKey);
}`
        },
        {
          id: "selinux-security",
          name: "SELinux Security Policies",
          type: "compute",
          tech: "SELinux / Android te Policies",
          role: "Permission Controls & IPC Domain Isolation",
          latency: "0.2ms",
          details: "Defines strict SELinux type enforcement rules (te files), confining system services and preventing unauthorized JNI/HAL access across user/system domains.",
          code: `# harman_diagnostic_service.te
type harman_diagnostic_service, domain;
type harman_diagnostic_service_exec, exec_type, file_type, system_file_type;

init_daemon_domain(harman_diagnostic_service)
binder_use(harman_diagnostic_service)
allow harman_diagnostic_service hwservicemanager_prop:file read;
allow harman_diagnostic_service hal_camera_hwservice:hwservice_manager find;`
        },
        {
          id: "jni-hal-layer",
          name: "JNI & HAL Layer APIs",
          type: "storage",
          tech: "C++ / JNI / Hardware Abstraction Layer (HAL)",
          role: "Low-level Hardware & Remote Display Controller",
          latency: "2.5ms",
          details: "Native C++ shared libraries interfacing with vehicle hardware via HAL modules, controlling camera sensors, CAN bus controllers, and USB host controller drivers.",
          code: `// JNI Native Binding for Camera/USB HAL
JNIEXPORT jint JNICALL
Java_com_harman_ivi_hal_NativeHalBridge_nativeGetPortStatus(
    JNIEnv *env, jobject thiz, jint port_id) {
    android::sp<IUsbDiagnosticHal> hal = IUsbDiagnosticHal::getService();
    if (hal == nullptr) return -1;
    return hal->queryPortHardwareStatus(port_id);
}`
        }
      ],
      connections: [
        { from: "hmi-app", to: "aidl-ipc", label: "AIDL / Binder IPC" },
        { from: "aidl-ipc", to: "selinux-security", label: "SELinux Policy Check" },
        { from: "selinux-security", to: "jni-hal-layer", label: "JNI Native Calls" }
      ]
    },
    {
      id: "android-auto-projection",
      title: "PSA Peugeot Android Auto Projection (Wired & Wireless)",
      subtitle: "Low-latency video decoding, ASR/VR modules & Google PCTS certification",
      description: "High-performance projection stack for PSA digital infotainment systems. Handles wired USB and wireless Wi-Fi P2P connection sequences, MediaCodec hardware decoding, VR/ASR voice integration, and Google compliance suites.",
      metrics: {
        projectionMode: "Wired + Wireless P2P",
        videoLatency: "< 20 ms",
        codec: "Hardware H.264 / H.265",
        compliance: "Google PCTS / AA Passed"
      },
      nodes: [
        {
          id: "mobile-device",
          name: "Connected Smartphone",
          type: "ingress",
          tech: "Android Auto App / USB / Wi-Fi P2P",
          role: "Sensor & Video/Audio Projection Source",
          latency: "5ms",
          details: "Initiates Android Auto handshake over USB accessory mode or Wi-Fi Direct (5GHz). Streams encrypted video frames and audio packets.",
          code: `// USB Accessory Handshake Sequence
val manager = context.getSystemService(Context.USB_SERVICE) as UsbManager
val accessoryList = manager.accessoryList
val autoAccessory = accessoryList?.firstOrNull { it.manufacturer == "Google, Inc." }
if (autoAccessory != null) {
    startProjectionPipeline(autoAccessory)
}`
        },
        {
          id: "protocol-stack",
          name: "Connection & Session Manager",
          type: "compute",
          tech: "Android Auto Protocol / PSA IVI Stack",
          role: "Handshake, Authentication & VR/ASR Routing",
          latency: "3ms",
          details: "Manages encrypted control channels, Voice Recognition (VR) / Automated Speech Recognition (ASR) routing, and Bluetooth HFP/A2DP audio switching.",
          code: `// VR / ASR Intent Trigger
fun onVoiceButtonClick() {
    projectionSession.sendControlMessage(
        ControlMessage.Builder()
            .setType(ControlMessage.TYPE_VOICE_SESSION_START)
            .build()
    )
}`
        },
        {
          id: "mediacodec-pipeline",
          name: "MediaCodec HW Video Pipeline",
          type: "compute",
          tech: "Android MediaCodec / SurfaceView / OpenGL",
          role: "Hardware-Accelerated Zero-Copy Video Decoding",
          latency: "8ms",
          details: "Decodes H.264/H.265 video streams with direct hardware acceleration to display Surface, ensuring jitter-free 60fps infotainment projection.",
          code: `// Hardware MediaCodec Video Decoder
val decoder = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
val format = MediaFormat.createVideoFormat(MediaFormat.MIMETYPE_VIDEO_AVC, 1920, 720).apply {
    setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatSurface)
}
decoder.configure(format, displaySurface, null, 0)
decoder.start()`
        },
        {
          id: "pcts-validation",
          name: "Google PCTS & Certification",
          type: "storage",
          tech: "Google PCTS / Protocol Compliance Test",
          role: "Automated Compliance & Stress Validation",
          latency: "1ms",
          details: "Executes rigorous Google PCTS (Projection Compatibility Test Suite) test cases, verifying connection timings, audio ducking, and fail-safe disconnects.",
          code: `// PCTS Automated Test Run Hook
./pcts-runner --device=psa-ivi-headunit \\
              --suite=AndroidAuto_Wireless_Compliance \\
              --repeat=100 \\
              --verify-rtt=true`
        }
      ],
      connections: [
        { from: "mobile-device", to: "protocol-stack", label: "USB / Wi-Fi P2P Handshake" },
        { from: "protocol-stack", to: "mediacodec-pipeline", label: "Encrypted H.264 Stream" },
        { from: "mediacodec-pipeline", to: "pcts-validation", label: "Surface Render & Telemetry" }
      ]
    },
    {
      id: "media-streaming-tv",
      title: "Low-Latency ExoPlayer Streaming (Android TV & Fire TV)",
      subtitle: "Adaptive Bitrate (ABR) engine with Leanback UI architecture",
      description: "High-performance multimedia streaming architecture developed for Ditty TV and OTT applications, featuring adaptive bitrate switching, custom ExoPlayer rendering pipelines, and background caching.",
      metrics: {
        bufferingTime: "< 350 ms",
        abrEfficiency: "Dynamic HLS / DASH",
        uiFramework: "Android Leanback & MVVM",
        crashRate: "< 0.01%"
      },
      nodes: [
        {
          id: "leanback-ui",
          name: "Android TV Leanback UI",
          type: "ingress",
          tech: "Kotlin / Leanback Library / MVVM",
          role: "10-foot TV Interface & D-pad Navigation",
          latency: "3ms",
          details: "Customized BrowseSupportFragment and DetailsSupportFragment optimized for TV remote D-pad focus states and fluid 60fps animations.",
          code: `class VideoDetailsFragment : DetailsSupportFragment() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupDetailsOverviewRow()
    }
}`
        },
        {
          id: "exoplayer-core",
          name: "ExoPlayer ABR Pipeline",
          type: "compute",
          tech: "ExoPlayer 2.x / HLS / DASH / MediaSource",
          role: "Adaptive Bitrate Streaming & Track Selection",
          latency: "6ms",
          details: "Custom DefaultTrackSelector and BandwidthMeter dynamically balancing bitrate switches during bandwidth fluctuations to eliminate stutter.",
          code: `val trackSelector = DefaultTrackSelector(context).apply {
    setParameters(buildUponParameters().setMaxVideoSizeSd())
}
val player = ExoPlayer.Builder(context)
    .setTrackSelector(trackSelector)
    .setMediaSourceFactory(DefaultMediaSourceFactory(dataSourceFactory))
    .build()`
        },
        {
          id: "cache-storage",
          name: "Segment Cache & Offline Store",
          type: "storage",
          tech: "SimpleCache / SQLite Room",
          role: "Chunk Pre-buffering & Metadata Persistence",
          latency: "2ms",
          details: "Pre-fetches the initial 5 seconds of upcoming audio/video tracks in a background LRU cache, enabling instantaneous instant-play playback.",
          code: `val cache = SimpleCache(cacheDir, LeastRecentlyUsedCacheEvictor(100 * 1024 * 1024), databaseProvider)
val cacheDataSourceFactory = CacheDataSource.Factory()
    .setCache(cache)
    .setUpstreamDataSourceFactory(httpDataSourceFactory)`
        }
      ],
      connections: [
        { from: "leanback-ui", to: "exoplayer-core", label: "Media URI Selection" },
        { from: "exoplayer-core", to: "cache-storage", label: "LRU Segment Caching" }
      ]
    }
  ],

  // Deep-Dive Architectural Case Studies
  caseStudies: [
    {
      id: "harman-msil-ivi",
      title: "MSIL (Maruti Suzuki) System-Level Diagnostic IVI Platform",
      subtitle: "60+ automotive diagnostic features, JNI/HAL middleware & SELinux enforcement",
      category: "AOSP & Automotive IVI",
      timeframe: "2023 - Present",
      impactSummary: "Architected and engineered a comprehensive system-level diagnostic IVI application from scratch for Maruti Suzuki vehicles at Harman International. Integrated USB, MIC, Display, and Camera stacks with AIDL, HAL layer APIs, and custom SELinux security policies.",
      tags: ["AOSP", "AAOS", "AIDL", "HAL", "SELinux", "JNI", "Binder IPC", "C++", "Kotlin"],
      stats: [
        { label: "Diagnostic Features", before: "0 (New Platform)", after: "60+ Built", highlight: "Full Spec Complete" },
        { label: "IPC Overhead", before: "8.5 ms", after: "1.2 ms", highlight: "85% Faster IPC" },
        { label: "SELinux Security", before: "Permissive", after: "100% Enforcing", highlight: "Zero Policy Violations" },
        { label: "Camera/RVC Latency", before: "180 ms", after: "< 45 ms", highlight: "Instant RVC Switch" }
      ],
      challenge: "Automotive diagnostic modes (Factory Mode, Dealer Mode, Engineering Mode) require direct access to low-level hardware registers, port-wise USB detection, Rear View Camera (RVC) remote displays, and CAN bus switches. Achieving this while maintaining strict Android SELinux domain isolation without compromising system security or causing memory leaks was a critical requirement.",
      solution: "Engineered a modular architecture separating the HMI diagnostic application from the underlying hardware via a dedicated SystemService with AIDL interfaces. Implemented JNI native wrappers over C++ HAL drivers and wrote custom SELinux type enforcement (.te) policies ensuring strict access control and zero IPC permission leaks.",
      architectureHighlights: [
        "Architected USB port-wise detection (Host/CarPlay/AA & OTG) and full IOC hardware telemetry (Dual-MIC array, VSS speed pulses, HVAC fan steps 1-7, Hardkeys & SWC steering controls).",
        "Engineered Camera sub-systems: RVC with Static & Dynamic steering guidelines (steering angle sync), SVS 360° bird-eye view, 3D vehicle body color customization, and camera distortion calibration.",
        "Integrated Audio & Tuner DSP: Arkamys 3D spatial sound staging, Loudness EQ filter, AM/FM RDS auto-scan, and DAB+ Band III digital radio.",
        "Implemented Safety & Security: Security PIN log gateway, SELinux enforcing policies (.te), S@R content restriction (speed lockout), and logging sub-systems (BT snoop, dmesg, tombstone crash dump extraction)."
      ],
      codeSnippet: {
        language: "kotlin",
        title: "AIDL SystemService & Hardware Diagnostic Bridge",
        code: `// AIDL SystemService Implementation for Hardware Diagnostics
class DiagnosticServiceImpl(private val context: Context) : IDiagnosticService.Stub() {
    
    private val nativeHal = NativeDiagnosticHalBridge()

    override fun getUsbPortStatus(portIndex: Int): Int {
        enforceCallingOrSelfPermission(
            "com.harman.permission.ACCESS_DIAGNOSTIC_HARDWARE",
            "Requires ACCESS_DIAGNOSTIC_HARDWARE permission"
        )
        return nativeHal.queryUsbPortStatus(portIndex)
    }

    override fun setRemoteDisplayState(active: Boolean) {
        val uid = Binder.getCallingUid()
        if (uid != Process.SYSTEM_UID && uid != Process.ROOT_UID) {
            throw SecurityException("Only system UID can switch remote display state")
        }
        nativeHal.setRemoteDisplayActive(active)
    }
}`
      }
    },
    {
      id: "harman-psa-android-auto",
      title: "PSA Peugeot Android Auto Projection (Wired & Wireless) & Google PCTS",
      subtitle: "Low-latency MediaCodec video pipeline, VR/ASR integration & Google Certification",
      category: "Android Auto & MediaCodec",
      timeframe: "2023 - Present",
      impactSummary: "Engineered and optimized the Android Auto projection module (Wired USB & Wireless Wi-Fi P2P) for PSA Peugeot digital infotainment head units. Handled connection sequences, MediaCodec hardware decoding, VR/ASR modules, and achieved 100% Google PCTS compliance.",
      tags: ["Android Auto", "MediaCodec", "Google PCTS", "Wi-Fi P2P", "VR / ASR", "Audio Ducking", "SELinux"],
      stats: [
        { label: "Google PCTS Suite", before: "Failing 14 Cases", after: "100% Passed", highlight: "Certified Ready" },
        { label: "Video Pipeline Latency", before: "65 ms", after: "< 20 ms", highlight: "69% Latency Drop" },
        { label: "Wireless Connection", before: "18 seconds", after: "4.2 seconds", highlight: "4.2x Faster Connect" },
        { label: "Frame Drops (60fps)", before: "4.8%", after: "< 0.05%", highlight: "Smooth 60 FPS" }
      ],
      challenge: "Wireless Android Auto on automotive head units suffers from packet jitter, connection handshake race conditions, audio ducking glitches during ASR/VR voice prompts, and frame tearing if MediaCodec is not tightly synchronized with the display surface.",
      solution: "Refactored the projection pipeline to utilize asynchronous MediaCodec hardware buffers configured for low-latency surface rendering. Optimized Wi-Fi P2P handshakes with preemptive channel selection and tuned audio focus arbitration during Voice Recognition (VR) sessions to pass all Google PCTS test suites.",
      architectureHighlights: [
        "Implemented end-to-end Android Auto connection sequence (USB Accessory & Wi-Fi Direct 5GHz).",
        "Streamlined Voice Recognition (VR) and Automated Speech Recognition (ASR) audio ducking and routing.",
        "Resolved deep kernel and AOSP crash dumps, resolving native memory leaks in embedded IVI environments."
      ],
      codeSnippet: {
        language: "java",
        title: "MediaCodec Low-Latency Surface Decoder Configuration",
        code: `// Low-Latency MediaCodec Video Pipeline for Android Auto Projection
public class ProjectionVideoDecoder {
    private MediaCodec mDecoder;

    public void initDecoder(Surface displaySurface, int width, int height) throws IOException {
        MediaFormat format = MediaFormat.createVideoFormat(MediaFormat.MIMETYPE_VIDEO_AVC, width, height);
        format.setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatSurface);
        format.setInteger(MediaFormat.KEY_LOW_LATENCY, 1); // Enable low latency mode
        format.setInteger(MediaFormat.KEY_PRIORITY, 0);   // Real-time priority

        mDecoder = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_VIDEO_AVC);
        mDecoder.configure(format, displaySurface, null, 0);
        mDecoder.setCallback(new MediaCodec.Callback() {
            @Override
            public void onInputBufferAvailable(MediaCodec codec, int index) {
                // Feed incoming NAL units from USB/Wi-Fi socket
            }

            @Override
            public void onOutputBufferAvailable(MediaCodec codec, int index, MediaCodec.BufferInfo info) {
                // Render directly to Surface at presentation timestamp
                codec.releaseOutputBuffer(index, true);
            }

            @Override
            public void onError(MediaCodec codec, MediaCodec.CodecException e) {
                Log.e("ProjectionDecoder", "MediaCodec error: " + e.getMessage());
            }

            @Override
            public void onOutputFormatChanged(MediaCodec codec, MediaFormat format) {}
        });
        mDecoder.start();
    }
}`
      }
    },
    {
      id: "ditty-tv-streaming",
      title: "Ditty TV & OTT Streaming Architecture (Android TV & Fire TV)",
      subtitle: "ExoPlayer ABR streaming engine with Leanback UI & background caching",
      category: "Multimedia & Android TV",
      timeframe: "2021 - 2022",
      impactSummary: "Built an Americana music streaming application for Android TV and Fire TV using Kotlin, ExoPlayer, and Android Leanback architecture, providing smooth adaptive bitrate video playback and seamless 10-foot remote navigation.",
      tags: ["Kotlin", "ExoPlayer", "Android TV", "Leanback", "Fire TV", "MVVM", "Firebase"],
      stats: [
        { label: "Initial Buffer Time", before: "1.8 sec", after: "320 ms", highlight: "82% Faster Start" },
        { label: "App Crash Rate", before: "1.2%", after: "< 0.01%", highlight: "99.99% Crash-Free" },
        { label: "ABR Stalls / Session", before: "3.4 stalls", after: "0.2 stalls", highlight: "94% Less Buffering" },
        { label: "Target Platforms", before: "Mobile Only", after: "Mobile + TV + FireTV", highlight: "Multi-Platform" }
      ],
      challenge: "Android TV and Amazon Fire TV devices feature varied hardware decoder capabilities and constrained RAM. Inefficient media player lifecycle handling led to OutOfMemory (OOM) crashes and slow channel change times.",
      solution: "Implemented ExoPlayer with customized DataSource factories, LRU segment pre-buffering, and asynchronous view holder recycling within the Leanback BrowseSupportFragment architecture.",
      architectureHighlights: [
        "Architected custom ExoPlayer track selectors optimized for adaptive HLS / DASH streaming.",
        "Built seamless D-pad focus management and 10-foot TV navigation using Android Leanback components.",
        "Integrated Room SQLite database for offline caching and metadata persistence."
      ],
      codeSnippet: {
        language: "kotlin",
        title: "ExoPlayer Adaptive Bitrate (ABR) Controller",
        code: `// ExoPlayer High-Performance ABR Builder
fun buildOptimizedPlayer(context: Context, surfaceView: SurfaceView): ExoPlayer {
    val bandwidthMeter = DefaultBandwidthMeter.Builder(context).build()
    val trackSelectionFactory = AdaptiveTrackSelection.Factory(
        1000, // min duration for quality increase (ms)
        2000, // max duration for quality decrease (ms)
        AdaptiveTrackSelection.DEFAULT_MIN_DURATION_TO_RETAIN_AFTER_DISCARD_MS,
        AdaptiveTrackSelection.DEFAULT_BANDWIDTH_FRACTION
    )
    val trackSelector = DefaultTrackSelector(context, trackSelectionFactory)

    return ExoPlayer.Builder(context)
        .setTrackSelector(trackSelector)
        .setBandwidthMeter(bandwidthMeter)
        .build().apply {
            setVideoSurfaceView(surfaceView)
        }
}`
      }
    }
  ],

  // Technical Competency Matrix
  skills: [
    {
      category: "Android Framework & Automotive",
      icon: "cpu",
      description: "AOSP, Automotive OS, HAL/AIDL, and system services",
      items: [
        { name: "AOSP & AAOS (Automotive)", level: 95, years: "6.9 yrs", highlight: "AOSP builds, System Services, Framework Internals, HMI" },
        { name: "C & C++ (Native Development)", level: 90, years: "3 yrs", highlight: "C++17/20, JNI bridges, AOSP native services, HAL implementation, POSIX" },
        { name: "Android Auto (Wired / Wireless)", level: 96, years: "4+ yrs", highlight: "Wi-Fi P2P, USB Accessory, Google PCTS Certification" },
        { name: "AIDL & Binder IPC", level: 94, years: "6.5 yrs", highlight: "Cross-process communication, System Services, IPC Security" },
        { name: "SELinux Security Policies", level: 90, years: "4 yrs", highlight: "Type enforcement (.te), Domain isolation, Permission controls" },
        { name: "HAL & JNI Native Layer", level: 88, years: "5 yrs", highlight: "C++ HAL interfaces, JNI bridges, Driver interactions" },
        { name: "System-Level Debugging", level: 92, years: "6.9 yrs", highlight: "Crash dump analysis, memory leak resolution, logcat/dmesg" }
      ]
    },
    {
      category: "Core Android & Architecture",
      icon: "smartphone",
      description: "Modern Android application architecture, Jetpack, and multithreading",
      items: [
        { name: "Kotlin & Java", level: 96, years: "6.9 yrs", highlight: "Coroutines, Flow, OOP, Generics, Memory Optimization" },
        { name: "C & C++", level: 90, years: "3 yrs", highlight: "Native C/C++ development, NDK, JNI, performance critical code" },
        { name: "Architecture Patterns", level: 94, years: "6.9 yrs", highlight: "MVVM, MVP, Clean Architecture, Repository Pattern" },
        { name: "Jetpack Components", level: 92, years: "6 yrs", highlight: "ViewModel, LiveData, WorkManager, Navigation, CameraX" },
        { name: "Dependency Injection", level: 90, years: "5 yrs", highlight: "Dagger 2, Hilt, Modular component binding" },
        { name: "Multithreading & Concurrency", level: 92, years: "6 yrs", highlight: "Kotlin Coroutines, RxJava 2/3, Thread pools, HandlerThread" },
        { name: "Networking & APIs", level: 94, years: "6.9 yrs", highlight: "Retrofit, OkHttp, WebSockets, REST APIs, JSON" }
      ]
    },
    {
      category: "Multimedia & Hardware Integration",
      icon: "film",
      description: "Audio/Video pipelines, video decoders, and external hardware",
      items: [
        { name: "MediaCodec (HW Decoding)", level: 90, years: "4 yrs", highlight: "Low-latency video decoding, SurfaceView rendering" },
        { name: "ExoPlayer (ABR Streaming)", level: 92, years: "5 yrs", highlight: "HLS, DASH, Adaptive bitrate, Custom MediaSource" },
        { name: "Android TV & Leanback UI", level: 88, years: "4 yrs", highlight: "10-foot UI, D-pad navigation, Fire TV compatibility" },
        { name: "Zebra Hardware SDK", level: 85, years: "3 yrs", highlight: "POS barcode scanners, RFID hardware integration" },
        { name: "WebRTC & P2P Media", level: 84, years: "3.5 yrs", highlight: "Real-time video/voice calling, P2P data channels" }
      ]
    },
    {
      category: "Storage, Tools & CI/CD",
      icon: "tool",
      description: "Persistence layers, version control, and build systems",
      items: [
        { name: "Room SQLite & Realm", level: 92, years: "6 yrs", highlight: "ORM database schemas, migrations, DAO queries, SQLite" },
        { name: "Git, SVN & Version Control", level: 94, years: "6.9 yrs", highlight: "Branching strategies, Gerrit code review, PR workflows" },
        { name: "Google PCTS Suite", level: 92, years: "4 yrs", highlight: "Automated Android Auto compliance, test suite execution" },
        { name: "JIRA, Jenkins & CI/CD", level: 88, years: "5 yrs", highlight: "Automated test pipelines, Continuous integration, Agile" },
        { name: "Firebase Suite", level: 90, years: "5 yrs", highlight: "Cloud Messaging (FCM), Realtime DB, Crashlytics, Auth" }
      ]
    }
  ],

  // Career Experience & Measurable Impact
  experience: [
    {
      role: "Senior Engineer — Product Development",
      company: "Harman International",
      period: "May 2023 – Present",
      location: "Bangalore, India",
      type: "Full-Time",
      description: "Leads Android Framework and Automotive IVI development for global automotive OEMs (PSA Peugeot, Maruti Suzuki), focusing on Android Auto projection, AOSP customization, and HAL/AIDL middleware.",
      achievements: [
        "Developing Android Auto (Wired & Wireless) projection stack for PSA Digital Infotainment Systems, handling connection sequences, media routing, and VR/ASR modules.",
        "Led end-to-end Google certification process (PCTS test cases) ensuring 100% compliance for wireless Android Auto projection.",
        "Architected system-level Diagnostic IVI application for MSIL (Maruti Suzuki) featuring Factory/Dealer/Eng modes, port-wise USB detection, RVC camera, and CAN SW across 60+ features.",
        "Integrated USB, MIC, and Display stacks with AIDL, HAL layer APIs, Binder IPC, System Service SELinux policies, and JNI-based native C++ libraries.",
        "Utilized MediaCodec for hardware-accelerated, low-latency video decoding and resolved critical system-level crashes & memory leaks in embedded environments."
      ]
    },
    {
      role: "Software Engineer (Android)",
      company: "Chetu India Pvt. Ltd",
      period: "Dec 2022 – May 2023",
      location: "Noida, India",
      type: "Full-Time",
      description: "Engineered complex enterprise Android applications from scratch utilizing clean MVVM architecture and integrated specialized hardware SDKs.",
      achievements: [
        "Developed scalable enterprise applications from ground up with MVVM architecture, LiveData, and Kotlin Coroutines.",
        "Integrated Zebra hardware barcode scanner and inventory tracking SDKs with Android POS applications (JoyApp POS).",
        "Conducted peer code reviews, enforced architecture best practices, and optimized network payload serialization."
      ]
    },
    {
      role: "Android Developer",
      company: "Fusioni Technology",
      period: "Mar 2021 – Dec 2022",
      location: "Noida, India",
      type: "Full-Time",
      description: "Led full-lifecycle development of multimedia streaming and OTT applications for Android Mobile and Android TV / Fire TV platforms.",
      achievements: [
        "Built high-performance media applications from scratch (similar to Hotstar Mobile and Android TV) using ExoPlayer and Leanback UI (Ditty TV).",
        "Implemented adaptive bitrate (ABR) video streaming with custom track selectors, reducing playback buffering by 82%.",
        "Collaborated with cross-functional teams to integrate REST APIs, Firebase backend services, and offline Room database caching."
      ]
    },
    {
      role: "Software Developer",
      company: "Praxiv Solutions",
      period: "Dec 2019 – Feb 2021",
      location: "Noida, India",
      type: "Full-Time",
      description: "Developed real-time communication, P2P video/voice calling, and secure payment-enabled Android applications.",
      achievements: [
        "Engineered P2P real-time chat, voice calling, and video streaming modules using WebRTC and Firebase (StarsGyan).",
        "Integrated offline data storage using Room SQLite and Firebase Realtime Database for seamless offline-first experience.",
        "Integrated secure payment gateways and verified end-to-end transactional security."
      ]
    }
  ],

  // Education Background
  education: [
    {
      degree: "B. Tech in Computer Science & Engineering",
      institution: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
      period: "2015 – 2019",
      location: "Amethi / Lucknow, India"
    },
    {
      degree: "XII (Intermediate)",
      institution: "SJBS IC",
      period: "2013 – 2015",
      location: "Amethi, India"
    },
    {
      degree: "X (High School)",
      institution: "DMPIC",
      period: "2013",
      location: "Navaha, Pratapgarh, India"
    }
  ],

  // Engineering Philosophy & Architectural Tenets
  tenets: [
    {
      number: "01",
      title: "Automotive-Grade Reliability & Zero Memory Leaks",
      principle: "In embedded IVI systems, apps run continuously for hours without rebooting. Rigorous memory profiling, leak-canary tracking, and native heap monitoring are non-negotiable."
    },
    {
      number: "02",
      title: "Enforcing Strict SELinux & IPC Isolation",
      principle: "Automotive safety requires zero-trust process isolation. System services must enforce permission barriers, AIDL verification, and strict SELinux type enforcement rules."
    },
    {
      number: "03",
      title: "Sub-Frame Latency via Hardware Acceleration",
      principle: "Projection and camera feeds demand low-latency execution. Direct MediaCodec decoding to SurfaceView and zero-copy JNI buffers prevent frame tearing and stutter."
    },
    {
      number: "04",
      title: "Comprehensive Compliance & Standards",
      principle: "Passing Google PCTS compliance suites requires strict adherence to audio focus ducking, graceful disconnect state machines, and robust error recovery."
    }
  ],

  // Publications, Certifications & Technical Writing
  publications: [
    {
      title: "Mastering Android Auto Wireless Projection: Protocol Handshakes, MediaCodec & Google PCTS",
      date: "2024",
      readTime: "10 min read",
      category: "Automotive Framework",
      abstract: "A comprehensive guide on implementing Wi-Fi P2P accessory handshakes, low-latency MediaCodec decoding, and passing Google PCTS certification suites.",
      link: "https://github.com/lavkush0101/"
    },
    {
      title: "Architecting System-Level Diagnostic IVI Applications in AOSP with AIDL and Custom SELinux Policies",
      date: "2024",
      readTime: "12 min read",
      category: "AOSP Architecture",
      abstract: "Deep dive into building factory/dealer diagnostic modes, hardware HAL bridges in C++, and writing secure SELinux .te domain policies.",
      link: "https://github.com/lavkush0101/"
    },
    {
      title: "Optimizing ExoPlayer for 10-Foot Leanback UI on Android TV & Amazon Fire TV",
      date: "2023",
      readTime: "8 min read",
      category: "Multimedia Engineering",
      abstract: "Best practices for adaptive bitrate streaming, LRU segment pre-caching, and smooth D-pad remote navigation on resource-constrained TV devices.",
      link: "https://github.com/lavkush0101/"
    },
    {
      title: "Binder IPC & HAL Layer Integration in Embedded Android Automotive Systems",
      date: "2023",
      readTime: "11 min read",
      category: "Embedded Systems",
      abstract: "Understanding Binder transaction limits, AIDL interface design, and JNI native bindings for vehicle hardware peripherals.",
      link: "https://github.com/lavkush0101/"
    }
  ],

  // Key Automotive & Android Projects
  openSource: [
    {
      name: "Harman MSIL Diagnostic IVI",
      role: "System Framework Developer",
      stars: "OEM Production",
      description: "System-level Diagnostic In-Vehicle Infotainment application with 60+ hardware test features for Maruti Suzuki.",
      language: "Kotlin / Java / C++ / AIDL",
      link: "https://github.com/lavkush0101/"
    },
    {
      name: "PSA Android Auto Projection",
      role: "Lead Projection Engineer",
      stars: "Google PCTS 100%",
      description: "Wired & Wireless Android Auto projection module with MediaCodec video decoding for PSA Peugeot head units.",
      language: "Java / MediaCodec / Wi-Fi P2P",
      link: "https://github.com/lavkush0101/"
    },
    {
      name: "Ditty TV (Android TV / Fire TV)",
      role: "Lead Android Developer",
      stars: "Production OTT",
      description: "Americana music streaming platform with adaptive bitrate ExoPlayer and Leanback TV architecture.",
      language: "Kotlin / ExoPlayer / Leanback",
      link: "https://github.com/lavkush0101/"
    },
    {
      name: "StarsGyan (Live Astrology & WebRTC)",
      role: "Android Developer",
      stars: "Live Platform",
      description: "Live consultation platform with real-time WebRTC video/voice calling and Firebase chat integration.",
      language: "Java / WebRTC / Firebase",
      link: "https://github.com/lavkush0101/"
    },
    {
      name: "JoyApp (Retail POS & Zebra SDK)",
      role: "Android Engineer",
      stars: "Enterprise POS",
      description: "Retail inventory and stock tracking application with Zebra hardware barcode scanner integration.",
      language: "Kotlin / SQLite / WorkManager",
      link: "https://github.com/lavkush0101/"
    }
  ]
};

if (typeof window !== "undefined") {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
