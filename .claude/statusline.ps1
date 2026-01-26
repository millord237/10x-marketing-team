# 10x Marketing Team - Claude Code Statusline (Windows PowerShell)
# This script displays contextual information about the current session

# Read JSON input from stdin
$input = [Console]::In.ReadToEnd()

try {
    $data = $input | ConvertFrom-Json

    $modelDisplay = if ($data.model.display_name) { $data.model.display_name } else { "Claude" }
    $currentDir = if ($data.workspace.current_dir) { Split-Path $data.workspace.current_dir -Leaf } else { "." }
    $cost = if ($data.cost.total_cost_usd) { $data.cost.total_cost_usd } else { 0 }
    $percentUsed = if ($data.context_window.used_percentage) { [math]::Round($data.context_window.used_percentage, 1) } else { 0 }

    $costFormatted = "{0:N4}" -f $cost

    Write-Host "🔥 10x Marketing | $modelDisplay | 📁 $currentDir | 💰 `$$costFormatted | 📊 $percentUsed%"
}
catch {
    Write-Host "🔥 10x Marketing | Ready"
}
