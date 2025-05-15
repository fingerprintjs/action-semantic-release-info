const cosmiconfig = require('cosmiconfig');

function extractPluginName(pluginName) {
    const atIndex = pluginName.lastIndexOf('@');
    return atIndex !== -1
        ? pluginName.substring(0, atIndex)
        : pluginName;
}

async function findPluginConfig(pluginName) {
    const { config } = await cosmiconfig.cosmiconfig('release').search();

    if (!config) {
        throw new Error(`Project semantic release config file not found.`);
    }

    if (!config.plugins || !Array.isArray(config.plugins)) {
        throw new Error(`Project release config file doesn't have plugins field.`);
    }

    const pluginConfig = config.plugins.find(plugin => {
        if (typeof plugin === 'string' && plugin !== pluginName) {
            return false;
        }

        if (!Array.isArray(plugin) || plugin.length <= 1) {
            return false;
        }

        if (plugin[0] !== pluginName) {
            return false;
        }

        return true;
    });

    return pluginConfig ? pluginConfig[1] : {};
}

module.exports.findPluginConfig = findPluginConfig;
module.exports.extractPluginName = extractPluginName;
