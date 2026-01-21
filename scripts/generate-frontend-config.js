const fs = require("fs");
const path = require("path");

async function main() {
  const contractsDir = path.join(__dirname, "../contracts");
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  const outputDir = path.join(__dirname, "../frontend-config");
  
  if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
  }

  const files = fs.readdirSync(contractsDir).filter(f => f.endsWith(".sol"));
  const config = {};

  for (const file of files) {
      const name = file.replace(".sol", "");
      const artifactPath = path.join(artifactsDir, file, `${name}.json`);
      
      if (fs.existsSync(artifactPath)) {
          const artifact = JSON.parse(fs.readFileSync(artifactPath));
          config[name] = {
              abi: artifact.abi,
              bytecode: artifact.bytecode
          };
      }
  }

  fs.writeFileSync(path.join(outputDir, "contract-data.json"), JSON.stringify(config, null, 2));
  console.log("Frontend config generated!");
}

main();
