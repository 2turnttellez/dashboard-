import { Config } from "@remotion/cli/config";

// Calidad de render para video vertical premium 9:16.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // auto
Config.setChromiumOpenGlRenderer("angle");

// Codec por defecto para exports MP4 (H.264).
Config.setCodec("h264");
