import { ActionIcon, Box, Flex } from '@mantine/core';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react'
import ExportExcel from '../../ExportExcel';
import { BsPrinter } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function TabAbsenKeluar ( {
    userDetail,
    karyawanid,
    absensiKeluar,
    formattedTotalEarlyDuration,
    formattedTotalOverDuration,
} )
{

    const navigate = useNavigate();

    const printAbsensi = () =>
    {
        navigate( "/absen-keluar/" + karyawanid );
    }

    const columns2 = useMemo(
        () => [
            {
                header: 'Tanggal',
                accessorFn: ( row ) => new Date( row.checkout_time ),
                filterVariant: 'date-range',
                Cell: ( { cell } ) => cell.getValue().toLocaleDateString(),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Jam',
                accessorFn: ( row ) => (
                    row.checkout_time.split( 'T' )[ 1 ].split( '.' )[ 0 ]
                ),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Pulang Awal',
                accessorKey: 'early_duration',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,

            },
            {
                header: 'Lembur',
                accessorKey: 'overtime_duration',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,

            },

        ],
        [],
    );


    const handleExportRowsExcelData2 = () =>
    {
        const excelData = table2.getRowModel().rows.map( ( row ) =>
        {
            const { original } = row;
            return {
                'Absen Keluar': original.checkout_time,
                'Pulang Awal': original.early_duration,
                'Lembur': original.overtime_duration,
                'Total Pulang Awal': formattedTotalEarlyDuration,
                'Total Lembur': formattedTotalOverDuration,
            };
        } );

        return excelData;
    };


    const table2 = useMantineReactTable( {
        columns: columns2,
        enableDensityToggle: false,
        initialState: { density: 'xs' },
        data: absensiKeluar,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        enableGlobalFilter: false,
        enableColumnResizing: false,
        isMultiSortEvent: () => true,
        mantineTableProps: {
            striped: true,
        },
        renderTopToolbarCustomActions: ( { table } ) => (
            <Box
                sx={ {
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                } }
            >
            </Box>
        ),
        renderToolbarInternalActions: ( { table } ) => (
            <Flex gap="xs" align="center">
                {/* add custom button to print table  */ }
                <ActionIcon
                    onClick={ printAbsensi }
                >
                    <BsPrinter
                        style={ { backgroundColor: 'transparent', color: '#222' } }
                        size={ 40 }
                    />
                </ActionIcon>
                <ActionIcon>
                    <ExportExcel
                        excelData={ handleExportRowsExcelData2( table.getRowModel().rows ) }
                        fileName={ `Data Absensi Pulang ${userDetail?.first_name} ${userDetail?.last_name}` }
                    />
                </ActionIcon>
            </Flex>
        ),
    } );

    return (
        <div>
            <MantineReactTable
                table={ table2 }
            />
        </div>
    )
}

export default TabAbsenKeluar
