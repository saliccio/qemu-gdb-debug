import * as vscode from 'vscode';

const SECTION_NAME = 'qemu-gdb-debug';
const DEBUG_SESSION_NAME = 'Debug Kernel with QEMU';

function getConfig() {
	return vscode.workspace.getConfiguration(SECTION_NAME);
}

function getCommandName(relativeName: string) {
	return `${SECTION_NAME}.${relativeName}`;
}

export function activate(context: vscode.ExtensionContext) {
	let config = getConfig();

	vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration(SECTION_NAME)) {
            config = getConfig();
        }
    });
	
	let disposable = vscode.commands.registerCommand(getCommandName('startQemu'), async () => {
		if (config.startQemuCommand == '') {
			vscode.window.showErrorMessage('No startQemuCommand defined in settings!');
			return;
		}

		const task = new vscode.Task(
			{ type: SECTION_NAME, task: 'startQemu' },
			vscode.workspace.workspaceFolders![0],
			'Start QEMU',
			'extension',
			new vscode.ShellExecution(
				config.startQemuCommand,
				{ cwd: vscode.workspace.workspaceFolders![0].uri.fsPath }
			)
		);
		task.isBackground = true;
		await vscode.tasks.executeTask(task);
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand(getCommandName('debug'), async () => {
		if ([config.gdbPath, config.executablePath, config.serverAddress].includes('')) {
			vscode.window.showErrorMessage('No gdbPath or executablePath or serverAddress defined in settings!');
			return;
		}

		vscode.commands.executeCommand(getCommandName('startQemu'));
		await vscode.debug.startDebugging(undefined, {
			name: DEBUG_SESSION_NAME,
			type: 'cppdbg',
			request: 'launch',
			program: config.executablePath,
			args: [],
			stopAtEntry: false,
			cwd: '${workspaceFolder}',
			environment: [],
			externalConsole: false,
			MIMode: 'gdb',
			setupCommands: [
				{
					description: 'Enable pretty-printing for gdb',
					text: '-enable-pretty-printing',
					ignoreFailures: true
				}
			],
			miDebuggerPath: config.gdbPath,
			miDebuggerServerAddress: config.serverAddress,
			miDebuggerArgs: '',
			logging: {
				engineLogging: true
			}
		});
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand(getCommandName('stopQemu'), async () => {
		if (config.stopQemuCommand == '') {
			vscode.window.showErrorMessage('No stopQemuCommand defined in settings!');
			return;
		}

		const task = new vscode.Task(
			{ type: SECTION_NAME, task: 'stopQemu' },
			vscode.workspace.workspaceFolders![0],
			'Stop QEMU',
			'extension',
			new vscode.ShellExecution(
				config.stopQemuCommand,
				{ cwd: vscode.workspace.workspaceFolders![0].uri.fsPath }
			)
		);
		await vscode.tasks.executeTask(task);
	});

	context.subscriptions.push(disposable);

	disposable = vscode.debug.onDidTerminateDebugSession(async (e) => {
		if (e.name === DEBUG_SESSION_NAME && config.stopQemuCommand != '') {
			await vscode.commands.executeCommand(getCommandName('stopQemu'));
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
